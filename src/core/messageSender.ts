import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';

import TextResponse from '../classes/TextResponse';
import LocationResponse from '../classes/LocationResponse';
import ImageResponse from '../classes/ImageResponse';
import VoiceResponse from '../classes/VoiceResponse';
import UseCaseResponse from '../classes/UseCaseResponse';
import TextToSpeechConnector from '../connectors/textToSpeech/textToSpeechConnector';
import EndUseCaseResponse from '../classes/EndUseCaseResponse';

class MessageSender {
  private textToSpeech = new TextToSpeechConnector();

  private chatId: number;

  constructor(private telegramBot: TelegramBot) {
  }

  setChatId(chatId: number) {
    this.chatId = chatId;
  }

  async sendResponses(responses: AsyncGenerator<UseCaseResponse>): Promise<boolean> {
    let endUseCase = false;
    // eslint-disable-next-line no-restricted-syntax
    for await (const response of responses) {
      if (response instanceof EndUseCaseResponse) {
        endUseCase = true;
      }
      await this.sendResponse(response);
    }
    return endUseCase;
  }

  async sendResponse(response: UseCaseResponse): Promise<Message> {
    if (response instanceof TextResponse) {
      return this.telegramBot.sendMessage(this.chatId, response.text,
        { disable_web_page_preview: true });
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
export default MessageSender;
