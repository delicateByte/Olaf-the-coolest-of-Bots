import * as TelegramBot from 'node-telegram-bot-api';

import ProcessedTelegramMessage from '../classes/ProcessedTelegramMessage';
import TelegramMessageType from '../classes/TelegramMessageType';
import SpeechToTextConnector from '../connectors/speechToText/speechToTextConnector';


class IncomingMessageHandler {
  private speechToText = new SpeechToTextConnector();

  constructor(private telegramBot: TelegramBot) {
  }

  /** @function extractAndProcessMessage
   * Erkennt eingehende Nachrichten, klassifiziert diese und startet relevante
   * Bearbeitung für jede Nachricht
   * @param originalMessage Originale unformatierte Telegram Message inkl. Overhead
   * @returns  Telegram Message mit den wichtigsten Informationen für die Use cases
   */
  async extractAndProcessMessage(originalMessage): Promise<ProcessedTelegramMessage> {
    const telegramMessage = new ProcessedTelegramMessage(originalMessage);
    if ('voice' in originalMessage) {
      telegramMessage.type = TelegramMessageType.VOICE;
      telegramMessage.text = await this.convertAudioStreamToText(originalMessage);
      console.log(`Recognized text: ${telegramMessage.text}`);
    } else if ('location' in originalMessage) {
      telegramMessage.type = TelegramMessageType.LOCATION;
      telegramMessage.latitude = originalMessage.location.latitude;
      telegramMessage.longitude = originalMessage.location.longitude;
    } else if ('text' in originalMessage) {
      telegramMessage.type = TelegramMessageType.TEXT;
      telegramMessage.text = originalMessage.text;
    } else {
      throw new TypeError('Message type not supported');
    }
    return telegramMessage;
  }

  /** @function convertAudioStreamToText
   * Übersetzt Sprachnachricht von Telegram in Text (nutzt STT)
   * @param telegramMessage (telegramVoiceMessage)
   * @returns  erkannten Text aus der Sprachnachricht
   */
  private async convertAudioStreamToText(telegramMessage) {
    const audioStream = this.telegramBot.getFileStream(telegramMessage.voice.file_id);
    return this.speechToText.recognize(audioStream);
  }
}
export default IncomingMessageHandler;
