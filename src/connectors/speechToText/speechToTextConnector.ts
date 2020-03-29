const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

class SpeechToTextConnector {
  private api;

  constructor() {
    this.api = new SpeechToTextV1({
      authenticator: new IamAuthenticator({ apikey: process.env.SPEECH_TO_TEXT_APIKEY }),
      url: process.env.SPEECH_TO_TEXT_URL,
    });
  }

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
