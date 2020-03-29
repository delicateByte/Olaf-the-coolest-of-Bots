import * as TelegramBot from 'node-telegram-bot-api';

import TelegramMessageType from '../classes/TelegramMessageType';
import SpeechToTextConnector from '../connectors/speechToText/speechToTextConnector';
import ProcessedTelegramMessage from '../classes/ProcessedTelegramMessage';


class IncomingMessageHandler {
  private speechToText = new SpeechToTextConnector();

  constructor(private telegramBot: TelegramBot) {
  }

  async extractMessage(originalMessage): Promise<ProcessedTelegramMessage> {
    const telegramMessage = new ProcessedTelegramMessage(originalMessage);
    if ('voice' in originalMessage) {
      telegramMessage.type = TelegramMessageType.VOICE;
      telegramMessage.text = await this.convertAudioStreamToText(originalMessage);
      console.log(`Recognized text: ${telegramMessage.text}`);
    } else if ('location' in originalMessage) {
      telegramMessage.type = TelegramMessageType.LOCATION;
      telegramMessage.latitude = originalMessage.latitude;
      telegramMessage.longitude = originalMessage.longitude;
    } else if ('text' in originalMessage) {
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
