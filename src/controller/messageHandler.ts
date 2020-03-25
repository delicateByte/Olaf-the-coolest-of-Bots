// external Modules

// internal Modules
import { WatsonSpeechToText } from './controllerSpeechToText'
import { WatsonTextToSpeech } from './controllerTextToSpeech'
import { TelegramBotManager } from '../pda';
import * as BrainState from './brainState'
import * as Router from './messageRouter'
import { LocationResponse } from '../classes/locationResponse';
import { ImageResponse } from '../classes/imageResponse';
import { VoiceResponse } from '../classes/voiceResponse';
import { UseCaseInformation } from '../classes/UseCaseInformation';
import { MessageResponseType } from '../classes/messageResponseTypeEnum';
// constants
const fs = require('fs');
const tempDirectory = require('temp-dir');
const tempy = require('tempy');


export namespace MessageHandler {

  export function classifyMessage(telegrambot, telegramMessage) {
    BrainState.setChatId(telegramMessage.from.id);
    const infoForUseCase = new UseCaseInformation(telegramMessage)
    const promise = new Promise((resolve, reject) => {
      if (telegramMessage.hasOwnProperty('voice')) {
        speechToTextConversionManager(telegrambot, telegramMessage).then((translatedText) => {
          infoForUseCase.text = "translatedText";
          infoForUseCase.messageType = "voice";

        }).catch((err) => { console.log(err); })
      } else if (telegramMessage.hasOwnProperty('location')) {
        infoForUseCase.lattitude = telegramMessage.lattitude;
        infoForUseCase.longitude = telegramMessage.longitude;
        infoForUseCase.messageType = "location";
      } else if (telegramMessage.hasOwnProperty('text')) {
        infoForUseCase.messageType = "text";
      } else {
        console.log("Message not classified");
      }
    });
    promise.then(() => {
      Router.routeMessages(infoForUseCase);
    }).catch((err) => {
      console.log(err)
    });

  }


  function speechToTextConversionManager(bot, msg) {
    return retrieveAudio(bot, msg).then((fileStream) => {
      return WatsonSpeechToText.convertSpeechToText(fileStream)
    }).then((text) => {
      console.log(text);
      return (text.toString())
    }).catch((err) => {
      console.log(err);
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



  export function sendAudioMessage(filepath) {
    const bot = TelegramBotManager.getTelegrambotInstance()
    const st = BrainState.getChatId();
    bot.sendVoice(st, filepath).then((voiceResponse) => {
      console.log("send Voiceresponse");
    }).catch((err) => {
      console.log(err);
      console.log(err);
    });
  }
  export function sendTextMessage(useCaseResponse) {
    const bot = TelegramBotManager.getTelegrambotInstance()

  }
  export function sendLocationMessage(locationResponse: LocationResponse) {
    const bot = TelegramBotManager.getTelegrambotInstance()
    bot.sendLocation(BrainState.getChatId(), locationResponse.latitude, locationResponse.longitude);
  }
  export function sendImageMessage(imageResponse: ImageResponse) {
    const bot = TelegramBotManager.getTelegrambotInstance()
    bot.sendPhoto(BrainState.getChatId(), imageResponse.imagePath);
  }

  export function sendVoiceMessage(voiceResponse: VoiceResponse) {
    const bot = TelegramBotManager.getTelegrambotInstance()

    WatsonTextToSpeech.textToSpeech(voiceResponse.textforVoiceMessage).catch((err) => {
      console.log(err);
    }).then((speechFilePath) => {
      console.log(speechFilePath + typeof speechFilePath);
      bot.sendVoice(BrainState.getChatId(), String(speechFilePath));
    });
  }
}
