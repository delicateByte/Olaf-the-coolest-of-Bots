// external Modules

// internal Modules
import { convertSpeechToText } from './controllerSpeechToText';
import { textToSpeech } from './controllerTextToSpeech';
import * as BrainState from './BrainState';
import LocationResponse from '../classes/LocationResponse';
import ImageResponse from '../classes/ImageResponse';
import VoiceResponse from '../classes/VoiceResponse';
import TelegramMessage from '../classes/TelegramMessage';
// constants
import { getTelegrambotInstance } from '../TelegramBotManager';
import TextResponse from '../classes/TextResponse';
import { routeMessageToUseCase } from './messageRouter';
import TelegramMessageType from '../classes/TelegramMessageType';


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

  textToSpeech(voiceResponse.textForVoiceMessage).catch((err) => {
    console.log(err);
  }).then((speechFilePath) => {
    console.log(speechFilePath + typeof speechFilePath);
    bot.sendVoice(BrainState.getChatId(), String(speechFilePath));
  });
}
export function classifyMessage(telegramBot, originalMessage) {
  BrainState.setChatId(originalMessage.from.id);
  const telegramMessage = new TelegramMessage(originalMessage);
  const promise = new Promise((resolve, reject) => {
    if (originalMessage.hasOwnProperty('voice')) {
      speechToTextConversionManager(telegramBot, originalMessage).then((translatedText) => {
        telegramMessage.text = translatedText;
        telegramMessage.type = TelegramMessageType.VOICE;
      }).catch((err) => { console.log(err); });
    } else if (originalMessage.hasOwnProperty('location')) {
      telegramMessage.latitude = originalMessage.latitude;
      telegramMessage.longitude = originalMessage.longitude;
      telegramMessage.type = TelegramMessageType.LOCATION;
    } else if (originalMessage.hasOwnProperty('text')) {
      telegramMessage.type = TelegramMessageType.TEXT;
    } else {
      console.log('Message not classified');
      reject();
    }
    resolve();
  });
  promise.then(() => {
    routeMessageToUseCase(telegramMessage);
  }).catch((err) => {
    console.log(err);
  });
}
