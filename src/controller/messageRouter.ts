// Import UseCases
// Import 1
// Import 2
// Import 3

// Import 4
// Import 5
import {
  sendImageMessage, sendLocationMessage, sendTextMessage, sendVoiceMessage,
} from './messageHandler';
import TelegramMessage from '../classes/TelegramMessage';
import TextResponse from '../classes/TextResponse';
import VoiceResponse from '../classes/VoiceResponse';
import LocationResponse from '../classes/LocationResponse';
import ImageResponse from '../classes/ImageResponse';
import EndUseCaseResponse from '../classes/EndUseCaseResponse';


export function extractUseCase(telegramMessageContent) {
  console.log(telegramMessageContent);
}
export function routeMessageToUseCase(message: TelegramMessage) {
  console.log(message);
}


function handleUseCaseResponse(useCaseResponse) {
  switch (true) {
    case useCaseResponse instanceof TextResponse:
      sendTextMessage(useCaseResponse);
      break;
    case useCaseResponse instanceof VoiceResponse:
      sendVoiceMessage(useCaseResponse);
      break;
    case useCaseResponse instanceof LocationResponse:
      sendLocationMessage(useCaseResponse);
      break;
    case useCaseResponse instanceof ImageResponse:
      sendImageMessage(useCaseResponse);
      break;
    case useCaseResponse instanceof EndUseCaseResponse:
      sendImageMessage(useCaseResponse);
      break;
    default:
      break;
  }
}
