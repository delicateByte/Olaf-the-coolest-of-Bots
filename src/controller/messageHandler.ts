// external Modules

// internal Modules
import { convertSpeechToText } from './controllerSpeechToText';
import { textToSpeech } from './controllerTextToSpeech';
import * as BrainState from './brainState';
import LocationResponse from '../classes/LocationResponse';
import ImageResponse from '../classes/ImageResponse';
import VoiceResponse from '../classes/VoiceResponse';
import UseCaseInformation from '../classes/UseCaseInformation';
// constants
import { getTelegrambotInstance } from '../TelegramBotManager';
import TextResponse from '../classes/TextResponse';
import { routeMessageToUseCase } from './messageRouter';


export function retrieveAudio(telegrambot, telegramMessage) {
  return new Promise(
    (resolve) => {
      resolve(telegrambot.getFile(telegramMessage.voice.file_id));
    },
  ).then(
    () => telegrambot.getFileStream(telegramMessage.voice.file_id),
  ).catch((err) => { console.log(err); });
}

function speechToTextConversionManager(bot, msg) {
  return retrieveAudio(bot, msg).then(
    (fileStream) => convertSpeechToText(fileStream),
  ).then((text) => {
    console.log(text);
    return (String(text));
  }).catch((err) => {
    console.log(err);
  });
}


export function sendTextMessage(textResponse:TextResponse) {
  const bot = getTelegrambotInstance();
  bot.sendMessage(BrainState.getChatId(), textResponse.responseMessage);
}
export function sendLocationMessage(locationResponse: LocationResponse) {
  const bot = getTelegrambotInstance();
  bot.sendLocation(BrainState.getChatId(), locationResponse.latitude, locationResponse.longitude);
}
export function sendImageMessage(imageResponse: ImageResponse) {
  const bot = getTelegrambotInstance();
  bot.sendPhoto(BrainState.getChatId(), imageResponse.imagePath);
}

export function sendVoiceMessage(voiceResponse: VoiceResponse) {
  const bot = getTelegrambotInstance();

  textToSpeech(voiceResponse.textforVoiceMessage).catch((err) => {
    console.log(err);
  }).then((speechFilePath) => {
    console.log(speechFilePath + typeof speechFilePath);
    bot.sendVoice(BrainState.getChatId(), String(speechFilePath));
  });
}
export function classifyMessage(telegramBot, telegramMessage) {
  BrainState.setChatId(telegramMessage.from.id);
  const infoForUseCase = new UseCaseInformation(telegramMessage);
  const promise = new Promise((resolve, reject) => {
    if (telegramMessage.hasOwnProperty('voice')) {
      speechToTextConversionManager(telegramBot, telegramMessage).then((translatedText) => {
        infoForUseCase.text = translatedText;
        infoForUseCase.messageType = 'voice';
      }).catch((err) => { console.log(err); });
    } else if (telegramMessage.hasOwnProperty('location')) {
      infoForUseCase.lattitude = telegramMessage.lattitude;
      infoForUseCase.longitude = telegramMessage.longitude;
      infoForUseCase.messageType = 'location';
    } else if (telegramMessage.hasOwnProperty('text')) {
      infoForUseCase.messageType = 'text';
    } else {
      console.log('Message not classified');
      reject();
    }
    resolve();
  });
  promise.then(() => {
    routeMessageToUseCase(infoForUseCase);
  }).catch((err) => {
    console.log(err);
  });
}
