import * as tempy from 'tempy';
import * as fs from 'fs';
import * as TextToSpeechV1 from 'ibm-watson/text-to-speech/v1';
import { IamAuthenticator } from 'ibm-watson/auth';


class TextToSpeechConnector {
  private api;

  constructor() {
    this.api = new TextToSpeechV1({
      authenticator: new IamAuthenticator({ apikey: process.env.TEXT_TO_SPEECH_APIKEY }),
      url: process.env.TEXT_TO_SPEECH_URL,
    });
  }

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
