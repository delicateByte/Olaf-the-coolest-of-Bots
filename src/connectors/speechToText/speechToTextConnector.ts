import * as SpeechToTextV1 from 'ibm-watson/speech-to-text/v1';
import { IamAuthenticator } from 'ibm-watson/auth';


class SpeechToTextConnector {
  private api;
  // initiate SpeechToText Instance & logon the Watson service
  constructor() {
    this.api = new SpeechToTextV1({
      authenticator: new IamAuthenticator({ apikey: process.env.SPEECH_TO_TEXT_APIKEY }),
      url: process.env.SPEECH_TO_TEXT_URL,
    });
  }

  /** @function recognize
   * recognizes spoken words in Voice stream
   * @param voiceRecordingStream  Stream einer audio Datei, die gesprochenes wort beinhaltet
   * @returns  String der die erkannten Wörter des streams enthält (Promise)
   */
  recognize(voiceRecordingStream): Promise<string> {
    return new Promise((resolve, reject) => {
      let result = '';
      const speechToTextStream = voiceRecordingStream.pipe(this.api.recognizeUsingWebSocket({ contentType: 'audio/ogg; rate=44100' }));
      speechToTextStream.on('data', (chunk) => { result += chunk; });
      speechToTextStream.on('error', (err) => reject(err));
      speechToTextStream.on('end', () => resolve(String(result)));
    });
  }
}
export default SpeechToTextConnector;
