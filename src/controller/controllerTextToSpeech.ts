import { MessageHandler } from "./messageHandler";
const fs = require('fs');
import * as BrainState from './brainState'
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

export namespace WatsonTextToSpeech {

  export function textToSpeech(text) {
    const textToSpeechInstance = new TextToSpeechV1({
      authenticator: new IamAuthenticator({
        apikey: process.env.TEXT_TO_SPEECH_APIKEY,
      }),
      url: process.env.TEXT_TO_SPEECH_URL,
    });
    const params = {
      text: text,
      accept: 'audio/ogg;codecs=opus',
    };

    // synthesizeUsingWebSocket returns a Readable Stream that can be piped or listened to
    const synthesizeStream = textToSpeechInstance.synthesizeUsingWebSocket(params);

    // the output of the stream can be piped to any writable stream, like an audio file
    synthesizeStream.then((streamedAudio) => { MessageHandler.sendAudioMessage(streamedAudio) });


  }

}
