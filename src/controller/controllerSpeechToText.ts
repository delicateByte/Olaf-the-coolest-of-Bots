const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');


export namespace WatsonSpeechToText {

  export function convertSpeechToText(voiceRecordingStream) {

    const speechToText = new SpeechToTextV1({
      authenticator: new IamAuthenticator({ apikey: process.env.SPEECH_TO_TEXT_APIKEY }),
      url: process.env.SPEECH_TO_TEXT_URL
    });
    return new Promise((resolve, reject) => {
      let result = '';
      let translation = voiceRecordingStream.pipe(speechToText.recognizeUsingWebSocket({ contentType: 'audio/ogg; rate=44100' }));
      translation.on('data', (chunk) => { result += chunk; resolve(result); });


    })




  }



}
