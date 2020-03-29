import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';
import { CronJob } from 'cron';

import MessageSender from './messageSender';
import IncomingMessageHandler from './incomingMessageHandler';
import MessageRouter from './messageRouter';
import EndUseCaseResponse from '../classes/EndUseCaseResponse';
import UseCase from '../interfaces/useCase';
import UseCaseResponse from '../classes/UseCaseResponse';
import TelegramMessageType from '../classes/TelegramMessageType';
import Preferences from './preferences';
import TextResponse from '../classes/TextResponse';
import ProcessedTelegramMessage from '../classes/ProcessedTelegramMessage';
import ImageofthedayUsecase from '../usecases/imageoftheday/imageofthedayUsecase';

class Olaf {
  private readonly telegramBot;

  private readonly messageHandler;
  private readonly messageRouter;
  private readonly messageSender;

  private activeUseCase: UseCase;
  private cronJobs: {[key: string]: CronJob} = [];

  constructor() {
    this.telegramBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
    this.messageHandler = new IncomingMessageHandler(this.telegramBot);
    this.messageRouter = new MessageRouter();
    this.messageSender = new MessageSender(this.telegramBot);
    this.activeUseCase = null;

    // TODO register all use cases here
    // this.messageRouter.registerUseCase(new XUseCase())
    this.messageRouter.registerUseCase(new ImageofthedayUsecase());
  }

  start() {
    this.telegramBot.on('message', (msg) => this.handleTelegramMessage(msg));

    Preferences.events().on('changed', (service, property) => {
      if (property.includes('Proactive')) {
        this.handleProactivePreferenceChange(service);
      }
    });
  }

  private async handleTelegramMessage(originalMessage: Message): Promise<void> {
    this.messageSender.setChatId(originalMessage.chat.id);

    try {
      // Extract message, including speech recognition
      const message = await this.messageHandler.extractMessage(originalMessage);
      // Get responses to send to the user
      const responses = await this.getResponses(message);
      // Send responses back to user
      await this.messageSender.sendResponses(responses);
      // Reset active use case if it is done
      if (responses.some((response) => response instanceof EndUseCaseResponse)) {
        this.activeUseCase.reset();
        this.activeUseCase = null;
      }
    } catch (err) {
      console.log(err);
      this.messageSender.sendResponse(new TextResponse(err.toString()));
    }
  }

  private async getResponses(message: ProcessedTelegramMessage): Promise<UseCaseResponse[]> {
    // Cancel active use case if user sends "stop"
    if (message.type === TelegramMessageType.TEXT && message.text.toLowerCase().includes('stop')) {
      return [new TextResponse('Use case stopped'), new EndUseCaseResponse()];
    }

    // Find matching use case
    if (!this.activeUseCase) {
      this.activeUseCase = this.messageRouter.findUseCaseByTrigger(message);
    }
    // Let use case handle the message
    return this.activeUseCase.receiveMessage(message);
  }

  private handleProactivePreferenceChange(service: string) {
    const enableProactivity = Preferences.get(service, `${service}Proactive`);

    if (service in this.cronJobs) {
      this.cronJobs[service].stop();
    }

    if (enableProactivity) {
      const time = Preferences.get(service, `${service}ProactiveTime`).split(':');
      const hour = time[0];
      const minute = time[1];

      const job = new CronJob(`0 ${minute} ${hour} * * *`, async () => {
        console.log(`Running scheduled use case ${service}`);
        const useCase = this.messageRouter.findUseCaseByName(service);
        const responses = await useCase.receiveMessage(null);
        await this.messageSender.sendResponses(responses);
      });
      this.cronJobs[service] = job;
      job.start();

      console.log(`Scheduled use case ${service} at ${hour}:${minute}`);
    }
  }
}
export default Olaf;
