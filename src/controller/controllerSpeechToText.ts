const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');


// eslint-disable-next-line import/prefer-default-export
export function convertSpeechToText(voiceRecordingStream) {
  const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({ apikey: process.env.SPEECH_TO_TEXT_APIKEY }),
    url: process.env.SPEECH_TO_TEXT_URL,
  });
  return new Promise((resolve) => {
    let result: string;
    result = '';
    const translation = voiceRecordingStream.pipe(speechToText.recognizeUsingWebSocket({ contentType: 'audio/ogg; rate=44100' }));
    translation.on('data', (chunk) => { result += chunk; resolve(String(result)); });
  });
}
