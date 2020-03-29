import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';

import MessageSender from './messageSender';
import IncomingMessageHandler from './incomingMessageHandler';
import MessageRouter from './messageRouter';
import EndUseCaseResponse from '../classes/EndUseCaseResponse';
import UseCase from '../interfaces/useCase';
import TelegramMessage from '../classes/TelegramMessage';
import UseCaseResponse from '../classes/UseCaseResponse';
import TelegramMessageType from '../classes/TelegramMessageType';
import TextResponse from '../classes/TextResponse';

class Olaf {
  private telegramBot;

  private messageHandler;

  private messageRouter;

  private messageSender;

  private activeUseCase: UseCase;

  constructor() {
    this.telegramBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
    this.messageHandler = new IncomingMessageHandler(this.telegramBot);
    this.messageRouter = new MessageRouter();
    this.messageSender = new MessageSender(this.telegramBot);
    this.activeUseCase = null;

    // TODO register all use cases here
    // this.messageRouter.registerUseCase(new XUseCase())
  }

  start() {
    this.telegramBot.on('message', (msg) => this.handleTelegramMessage(msg));
  }

  private async handleTelegramMessage(originalMessage: Message): Promise<void> {
    this.messageSender.setChatId(originalMessage.chat.id);

    try {
      // Extract message, including speech recognition
      const message = await this.messageHandler.extractMessage(originalMessage);
      // Get responses to send to the user
      const responses = await this.getResponses(message);
      // Send responses back to user
      responses.forEach((response) => this.messageSender.sendResponse(response));
      // Reset active use case if it is done
      if (responses.some((response) => response instanceof EndUseCaseResponse)) {
        this.activeUseCase.reset();
        this.activeUseCase = null;
      }
    } catch (err) {
      console.log(err);
      this.messageSender.sendResponse(err.toString());
    }
  }

  private async getResponses(message: TelegramMessage): Promise<UseCaseResponse[]> {
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
}
export default Olaf;
