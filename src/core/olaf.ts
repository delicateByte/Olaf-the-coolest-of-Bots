import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';

import MessageSender from './messageSender';
import IncomingMessageHandler from './incomingMessageHandler';
import MessageRouter from './messageRouter';
import EndUseCaseResponse from '../classes/EndUseCaseResponse';
import UseCase from '../interfaces/useCase';
import ProcessedTelegramMessage from '../classes/ProcessedTelegramMessage';
import UseCaseResponse from '../classes/UseCaseResponse';
import TextResponse from '../classes/TextResponse';
import Entertainment from '../usecases/entertainment/entertainment';

class Olaf {
  private readonly telegramBot;

  private readonly messageHandler;
  private readonly messageRouter;
  private readonly messageSender;

  private activeUseCase: UseCase;

  constructor() {
    this.telegramBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
    this.messageHandler = new IncomingMessageHandler(this.telegramBot);
    this.messageRouter = new MessageRouter();
    this.messageSender = new MessageSender(this.telegramBot);
    this.activeUseCase = null;

    // TODO register all use cases here
    // this.messageRouter.registerUseCase(new XUseCase())
    this.messageRouter.registerUseCase(new Entertainment());
  }

  start() {
    this.telegramBot.on('message', (msg) => this.handleTelegramMessage(msg));
  }

  private async handleTelegramMessage(originalMessage: Message): Promise<void> {
    this.messageSender.setChatId(originalMessage.chat.id);

    try {
      // Extract message, including speech recognition
      const message = await this.messageHandler.extractAndProcessMessage(originalMessage);
      // Get responses to send to the user
      const responses = this.getResponses(message);
      // Send responses back to user
      const endUseCase = await this.messageSender.sendResponses(responses);
      // Reset active use case if it is done
      if (endUseCase && this.activeUseCase) {
        this.activeUseCase.reset();
        this.activeUseCase = null;
      }
    } catch (err) {
      console.log(err);
      this.messageSender.sendResponse(new TextResponse(err.toString()));
    }
  }

  private async* getResponses(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    // Cancel active use case if user sends stop phrase
    if ('text' in message
      && ['stop', 'cancel', 'end'].some((phrase) => message.text?.toLowerCase().includes(phrase))) {
      if (this.activeUseCase) {
        yield new TextResponse('Use case stopped');
        yield new EndUseCaseResponse();
      } else {
        yield new TextResponse('No active use case');
      }
      return;
    }

    // Find matching use case
    if (!this.activeUseCase) {
      this.activeUseCase = this.messageRouter.findUseCaseByTrigger(message);
    }
    // Let use case handle the message
    yield* this.activeUseCase.receiveMessage(message);
  }
}
export default Olaf;
