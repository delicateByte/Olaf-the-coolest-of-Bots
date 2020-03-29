import * as TelegramBot from 'node-telegram-bot-api';

import TelegramMessage from '../classes/TelegramMessage';
import TelegramMessageType from '../classes/TelegramMessageType';
import SpeechToTextConnector from '../connectors/speechToText/speechToTextConnector';


class IncomingMessageHandler {
  private speechToText = new SpeechToTextConnector();

  constructor(private telegramBot: TelegramBot) {
  }

  async extractMessage(originalMessage): Promise<TelegramMessage> {
    const telegramMessage = new TelegramMessage(originalMessage);
    if (originalMessage.hasOwnProperty('voice')) {
      telegramMessage.type = TelegramMessageType.VOICE;
      telegramMessage.text = await this.convertAudioStreamToText(originalMessage);
      console.log(`Recognized text: ${telegramMessage.text}`);
    } else if (originalMessage.hasOwnProperty('location')) {
      telegramMessage.type = TelegramMessageType.LOCATION;
      telegramMessage.latitude = originalMessage.latitude;
      telegramMessage.longitude = originalMessage.longitude;
    } else if (originalMessage.hasOwnProperty('text')) {
      telegramMessage.type = TelegramMessageType.TEXT;
      telegramMessage.text = originalMessage.text;
    } else {
      throw new TypeError('Message type not supported');
    }
    return telegramMessage;
  }

  private async convertAudioStreamToText(telegramMessage) {
    const audioStream = this.telegramBot.getFileStream(telegramMessage.voice.file_id);
    return this.speechToText.recognize(audioStream);
  }
}
export default IncomingMessageHandler;
