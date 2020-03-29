import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';

import preferencesDashboard from '../dashboard/preferences-dashboard';
import MessageSender from './messageSender';
import IncomingMessageHandler from './incomingMessageHandler';
import MessageRouter from './messageRouter';
import EndUseCaseResponse from '../classes/EndUseCaseResponse';
import UseCase from '../interfaces/useCase';

class Olaf {
  private telegramBot;

  private dashboard;

  private messageHandler;

  private messageRouter;

  private messageSender;

  private activeUseCase: UseCase;

  constructor() {
    this.telegramBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
    this.dashboard = preferencesDashboard;
    this.messageHandler = new IncomingMessageHandler(this.telegramBot);
    this.messageRouter = new MessageRouter();
    this.messageSender = new MessageSender(this.telegramBot);
    this.activeUseCase = null;

    // TODO register all use cases here
    // this.messageRouter.registerUseCase(new XUseCase())
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
        this.activeUseCase = this.messageRouter.findUseCase(message);
      }
      // Let use case handle the message
      const responses = await this.activeUseCase.receiveMessage(message);
      // Send responses back to user
      responses.forEach((response) => this.messageSender.sendResponse(response));
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
export default Olaf;
