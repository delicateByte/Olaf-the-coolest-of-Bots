
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

export module SpeechToText {
  const textToSpeechv1 = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
      apikey: process.env.WATSON_TTS_APIKEY,
    }),
    url: process.env.TEXT_TO_SPEECH_URL,
  });

  function textToSpeech(text) {
    const synthesizeParams = {
      text,
      accept: "audio/mp3",
      voice: "en-US_AllisonVoice",
    };
    return textToSpeechv1.synthesize(synthesizeParams).then((response) => {
      const audioStream = response.result;
      resolve(audioStream);
    }).catch((err) => {
      console.error(err);
      reject(err);
    });
  }
}
