import { Message } from 'node-telegram-bot-api';
import TelegramMessageType from './TelegramMessageType';

class TelegramMessage {
  originalMessage: Message;

  type: TelegramMessageType;

  text: string | void;

  latitude?: number;

  longitude?: number;

  constructor(originalMessage: Message) {
    this.originalMessage = originalMessage;
  }
}
export default TelegramMessage;
