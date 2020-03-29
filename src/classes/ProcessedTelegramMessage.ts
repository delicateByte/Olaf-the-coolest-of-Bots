import { Message } from 'node-telegram-bot-api';
import TelegramMessageType from './TelegramMessageType';

class ProcessedTelegramMessage {
  originalMessage: Message;

  type: TelegramMessageType;

  text?: string;

  latitude?: number;

  longitude?: number;

  constructor(originalMessage: Message) {
    this.originalMessage = originalMessage;
  }
}
export default ProcessedTelegramMessage;
