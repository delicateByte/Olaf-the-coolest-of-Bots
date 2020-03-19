import * as BrainState from './brainState'
import * as Router from './messageRouter'
import { WatsonSpeechToText } from './controllerSpeechToText'
export namespace MessageHandler {


  export function classifyMessage(telegrambot, telegramMessage) {
    if (telegramMessage.hasOwnProperty('voice')) {
      speechConversion(telegrambot, telegramMessage)

    } else if (telegramMessage.hasOwnProperty('location')) {

    } else if (telegramMessage.hasOwnProperty('text')) {

    } else {
      console.log("Message not classified");

    }
  }


  export function speechConversion(bot, msg) {
    retrieveAudio(bot, msg).then((fileStream) => {
      console.log(WatsonSpeechToText.convertSpeechToText(fileStream));
      return 1;

    })
  }
  export function retrieveAudio(telegrambot, telegramMessage) {
    return new Promise(
      (resolve) => {
        resolve(telegrambot.getFile(telegramMessage.voice.file_id));
      }).then(
        (fileInformation) => {
          return telegrambot.getFileStream(telegramMessage.voice.file_id);
        });

  }
}
