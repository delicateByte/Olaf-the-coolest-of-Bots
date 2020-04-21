import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';
import { CronJob } from 'cron';

import MessageSender from './messageSender';
import IncomingMessageHandler from './incomingMessageHandler';
import MessageRouter from './messageRouter';
import EndUseCaseResponse from '../classes/EndUseCaseResponse';
import UseCase from '../interfaces/useCase';
import ProcessedTelegramMessage from '../classes/ProcessedTelegramMessage';
import UseCaseResponse from '../classes/UseCaseResponse';
import TextResponse from '../classes/TextResponse';
import Preferences from './preferences';
import EntertainmentUsecase from '../usecases/entertainment/entertainment';
import DailyFinancialStatus from '../usecases/dailyfinancialstatus/dfstatusUsecase';
import ImageofthedayUsecase from '../usecases/imageoftheday/imageofthedayUsecase';
import TranslatorUsecase from '../usecases/translator/translatorUsecase';
import NewsFlashUsecase from '../usecases/news/newsFlashUseCase';


class Olaf {
  private readonly telegramBot;
  private readonly messageHandler;
  private readonly messageRouter;
  private readonly messageSender;

  private activeUseCase: UseCase;
  private proactiveQueue: UseCase[];
  private proactiveJobs: { [key: string]: CronJob } = {
    imageoftheday: null,
    news: null,
    dfstatus: null,
  };

  constructor() {
    if (!('BOT_TOKEN' in process.env)) {
      console.log('Please set up the .env file according to the README');
      process.exit(1);
    }

    this.telegramBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
    this.messageHandler = new IncomingMessageHandler(this.telegramBot);
    this.messageRouter = new MessageRouter();
    this.messageSender = new MessageSender(this.telegramBot);
    this.activeUseCase = null;
    this.proactiveQueue = [];

    this.messageRouter.registerUseCase(new EntertainmentUsecase());
    this.messageRouter.registerUseCase(new DailyFinancialStatus());
    this.messageRouter.registerUseCase(new ImageofthedayUsecase());
    this.messageRouter.registerUseCase(new TranslatorUsecase());
    this.messageRouter.registerUseCase(new NewsFlashUsecase());
  }

  start() {
    // Start listening to Telegram messages
    this.telegramBot.on('message', (msg) => this.handleTelegramMessage(msg));

    // Start proactive jobs and listening to scheduling changes
    Object.keys(this.proactiveJobs).forEach((service) => this.scheduleProactivity(service));
    Preferences.events().on('changed', (service, property) => {
      if (property.includes('Proactive') && service in this.proactiveJobs) {
        this.scheduleProactivity(service);
      }
    });
  }

  private async handleTelegramMessage(originalMessage: Message): Promise<void> {
    this.messageSender.setChatId(originalMessage.chat.id);

    try {
      // Extract message, including speech recognition
      const message = await this.messageHandler.extractAndProcessMessage(originalMessage);
      await this.runUseCase(message);
    } catch (err) {
      console.log(err);
      await this.messageSender.sendResponse(new TextResponse(err.toString()));
    }
  }

  private async runUseCase(message: ProcessedTelegramMessage): Promise<void> {
    try {
      // Get responses to send to the user
      const responses = this.getResponses(message);
      // Send responses back to user
      const endUseCase = await this.messageSender.sendResponses(responses);
      // Reset active use case if it is done
      if (endUseCase && this.activeUseCase) {
        this.activeUseCase.reset();
        this.activeUseCase = null;

        // Run enqueued proactive use cases
        if (this.proactiveQueue.length) {
          this.activeUseCase = this.proactiveQueue.pop();
          await this.runUseCase(null);
        }
      }
    } catch (err) {
      console.log(err);
      await this.messageSender.sendResponse(new TextResponse(err.toString()));
    }
  }

  private async* getResponses(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    // Cancel active use case if user sends stop phrase
    if (message && message.text?.startsWith('/')) {
      yield* this.handleCommand(message.text.substr(1).toLowerCase());
      return;
    }

    // Find matching use case
    if (!this.activeUseCase) {
      this.activeUseCase = this.messageRouter.findUseCaseByTrigger(message);
    }
    // Let active use case handle the message
    yield* this.activeUseCase.receiveMessage(message);
  }

  private async* handleCommand(command: string): AsyncGenerator<UseCaseResponse> {
    const helpText = `Available use cases:
💰 Daily Financial Status: Get up-to-date exchange rates (financial, finance)
🎭 Entertainment: Discover memes, jokes and music (meme, joke, chuck norris, song, track, music, playlist)
📸 Image of the Day: Discover an image and learn more about it (image, photo, picture)
📰 News: Get the latest news and weather updates (news flash, news, flash me)
🌐 Translator: Retrieve local information and get translations (send your location)

End the active use case by texting /stop`;

    switch (command) {
      case 'start':
        yield new TextResponse(
          'Say Hi to Olaf, your personal assistant! ☃️ \n\nYou can let him help you by sending voice or text messages.',
        );
        yield new TextResponse(helpText);
        break;
      case 'help':
        yield new TextResponse(helpText);
        break;
      case 'settings':
        yield new TextResponse('Personalize Olaf under http://olaf-host:3000/');
        break;
      case 'stop':
        if (this.activeUseCase) {
          yield new TextResponse('Use case stopped');
          yield new EndUseCaseResponse();
        } else {
          yield new TextResponse('No active use case');
        }
        break;
      default:
        throw new Error('Unrecognized command');
    }
  }

  private scheduleProactivity(service: string) {
    if (this.proactiveJobs[service]) {
      this.proactiveJobs[service].stop();
      this.proactiveJobs[service] = null;
    }

    const enableProactivity = Preferences.get(service, `${service}Proactive`);
    if (enableProactivity) {
      const [hour, minute] = Preferences.get(service, `${service}ProactiveTime`).split(':');

      // Schedule use case daily at the specified time
      const job = new CronJob(`0 ${minute} ${hour} * * *`, async () => {
        console.log(`Running scheduled use case ${service}`);
        const useCase = this.messageRouter.findUseCaseByName(service);
        if (!this.activeUseCase) {
          this.activeUseCase = useCase;
          this.runUseCase(null);
        } else {
          // Do not interrupt the active use case
          // Run this proactive use case after the active use case finishes
          this.proactiveQueue.unshift(useCase);
        }
      });
      this.proactiveJobs[service] = job;
      job.start();

      console.log(`Scheduled use case ${service} at ${hour}:${minute}`);
    }
  }
}
export default Olaf;
