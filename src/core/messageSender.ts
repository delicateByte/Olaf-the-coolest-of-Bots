import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';

import TextResponse from '../classes/TextResponse';
import LocationResponse from '../classes/LocationResponse';
import ImageResponse from '../classes/ImageResponse';
import VoiceResponse from '../classes/VoiceResponse';
import UseCaseResponse from '../classes/UseCaseResponse';
import TextToSpeechConnector from '../connectors/textToSpeech/textToSpeechConnector';

export default class MessageSender {
  private textToSpeech = new TextToSpeechConnector();

  private chatId: number;

  constructor(private telegramBot: TelegramBot) {
  }

  setChatId(chatId: number) {
    this.chatId = chatId;
  }

  async sendResponse(response: UseCaseResponse | string): Promise<Message> {
    if (typeof response === 'string') {
      return this.telegramBot.sendMessage(this.chatId, response);
    }
    if (response instanceof TextResponse) {
      return this.telegramBot.sendMessage(this.chatId, response.text);
    }
    if (response instanceof VoiceResponse) {
      const audioPath = await this.textToSpeech.synthesize(response.text);
      return this.telegramBot.sendVoice(this.chatId, audioPath);
    }
    if (response instanceof LocationResponse) {
      return this.telegramBot.sendLocation(this.chatId, response.latitude, response.longitude);
    }
    if (response instanceof ImageResponse) {
      return this.telegramBot.sendPhoto(this.chatId, response.imagePath);
    }
    return Promise.resolve(null);
  }
}
