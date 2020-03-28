import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';

import preferencesDashboard from '../dashboard/preferences-dashboard';
import MessageSender from './messageSender';
import MessageHandler from './messageHandler';
import MessageRouter from './messageRouter';
import EndUseCaseResponse from '../classes/EndUseCaseResponse';
import UseCase from '../interfaces/useCase';
import ImageofthedayUsecase from '../usecases/imageoftheday/imageofthedayUsecase';

export default class Olaf {
  private telegramBot;

  private dashboard;

  private messageHandler;

  private messageRouter;

  private messageSender;

  private activeUseCase: UseCase;

  constructor() {
    this.telegramBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
    this.dashboard = preferencesDashboard;
    this.messageHandler = new MessageHandler(this.telegramBot);
    this.messageRouter = new MessageRouter();
    this.messageSender = new MessageSender(this.telegramBot);
    this.activeUseCase = null;

    // TODO register all use cases here
    // this.messageRouter.registerUseCase(new XUseCase())
    this.messageRouter.registerUseCase(new ImageofthedayUsecase());
  }

  start() {
    this.dashboard.listen(process.env.PORT, () => {
      console.log(`Dashboard is running in http://localhost:${process.env.PORT}`);
    });

    this.telegramBot.on('message', (msg) => this.handleTelegramMessage(msg));
  }

  private async handleTelegramMessage(originalMessage: Message): Promise<void> {
    this.messageSender.setChatId(originalMessage.chat.id);

    try {
      // Extract message, including speech recognition
      const message = await this.messageHandler.extractMessage(originalMessage);
      // Find matching use case
      if (!this.activeUseCase) {
        this.activeUseCase = await this.messageRouter.findUseCase(message);
      }
      if (!this.activeUseCase) {
        throw new Error('Invalid use case');
      }
      // Let use case handle the message
      const responses = await this.activeUseCase.receiveMessage(message);
      // Send responses back to user
      // eslint-disable-next-line no-restricted-syntax
      for (const response of responses) {
        // eslint-disable-next-line no-await-in-loop
        await this.messageSender.sendResponse(response);
      }
      // Reset active use case if it is done
      if (responses.some((response) => response instanceof EndUseCaseResponse)) {
        this.activeUseCase.reset();
        this.activeUseCase = null;
      }
    } catch (err) {
      this.messageSender.sendResponse(err.toString());
    }
  }
}
