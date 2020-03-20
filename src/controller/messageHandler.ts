import * as BrainState from './brainState'
import * as Router from './messageRouter'
const fs = require('fs');

import { WatsonSpeechToText } from './controllerSpeechToText'
import { WatsonTextToSpeech } from './controllerTextToSpeech'
import { TelegramBotManager } from '../pda';
export namespace MessageHandler {

  let st;
  export function classifyMessage(telegrambot, telegramMessage) {
    BrainState.setChatId(telegramMessage.from.id);
    if (telegramMessage.hasOwnProperty('voice')) {
      speechConversion(telegrambot, telegramMessage);
      st = BrainState.getChatId();
    } else if (telegramMessage.hasOwnProperty('location')) {

    } else if (telegramMessage.hasOwnProperty('text')) {

    } else {
      console.log("Message not classified");

    }
  }


  export function speechConversion(bot, msg) {
    retrieveAudio(bot, msg).then((fileStream) => {
      WatsonSpeechToText.convertSpeechToText(fileStream).then((text) => {
        return text
      }).then((text) => {
        sendAudioMessage(text);
      });


    })
  }
  export function retrieveAudio(telegrambot, telegramMessage) {
    return new Promise(
      (resolve) => {
        resolve(telegrambot.getFile(telegramMessage.voice.file_id));
      }).then(
        (fileInformation) => {
          return telegrambot.getFileStream(telegramMessage.voice.file_id);
        }).catch((err) => { console.log(err); });

  }

  export function prepAudioMessage(text) {
    WatsonTextToSpeech.textToSpeech(text);

  }
  export function sendAudioMessage(stream) {
    const bot = TelegramBotManager.getTelegrambotInstance()

    bot.sendVoice(st, stream).then((voiceResponse) => { console.log(voiceResponse) }).catch((err) => {
      console.log(err)
    });
  }
  export function sendTextMessage(useCaseResponse) {
    const bot = TelegramBotManager.getTelegrambotInstance()

  }
  export function sendLocationMessage(useCaseResponse) {
    const bot = TelegramBotManager.getTelegrambotInstance()

  }
  export function sendVideoMessage(useCaseResponse) {
    const bot = TelegramBotManager.getTelegrambotInstance()

  }
  export function sendImageMessage(useCaseResponse) {
    const bot = TelegramBotManager.getTelegrambotInstance()

  }
}
