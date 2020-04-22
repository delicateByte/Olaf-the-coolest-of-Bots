import * as tempy from 'tempy';
import * as fs from 'fs';
import * as TextToSpeechV1 from 'ibm-watson/text-to-speech/v1';
import { IamAuthenticator } from 'ibm-watson/auth';


class TextToSpeechConnector {
  private api;
  // Instanziiert TTS service und authentifiziert diesen in der IBM cloud
  constructor() {
    this.api = new TextToSpeechV1({
      authenticator: new IamAuthenticator({ apikey: process.env.TEXT_TO_SPEECH_APIKEY }),
      url: process.env.TEXT_TO_SPEECH_URL,
    });
  }

  /** @function synthesize
   * Übersetzt gegebenen Text in einen audoo Stream
   * @param text Der Text welcher ausgesprochen werden soll
   * @returns  Gibt den Pfad zurück indem der Audio stream gespeichert ist (Promise)
   */
  synthesize(text): Promise<string> {
    return new Promise((resolve, reject) => {
      const ttsFile = tempy.file({ extension: 'ogg' });

      const synthesizeStream = this.api.synthesizeUsingWebSocket({ text, accept: 'audio/ogg;codecs=opus' });
      synthesizeStream.pipe(fs.createWriteStream(ttsFile));

      synthesizeStream.on('error', (err) => reject(err));
      synthesizeStream.on('close', () => resolve(ttsFile));
    });
  }
}
export default TextToSpeechConnector;
