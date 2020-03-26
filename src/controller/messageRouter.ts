// Import UseCases
// Import 1
// Import 2
// Import 3
// Import 4
// Import 5
import {
  sendImageMessage, sendLocationMessage, sendTextMessage, sendVoiceMessage,
} from './messageHandler';
import UseCaseInformation from '../classes/UseCaseInformation';
import MessageResponseType from '../classes/messageResponseTypeEnum';


export function extractUseCase(telegramMessageContent) {
  console.log(telegramMessageContent);
}
export function routeMessageToUseCase(message: UseCaseInformation) {
  console.log(message);
}


function handleUseCaseResponse(useCaseResponse) {
  switch (useCaseResponse) {
    case MessageResponseType.text:
      sendTextMessage(useCaseResponse);
      break;
    case MessageResponseType.voice:
      sendVoiceMessage(useCaseResponse);
      break;
    case MessageResponseType.location:
      sendLocationMessage(useCaseResponse);
      break;
    case MessageResponseType.picture:
      sendImageMessage(useCaseResponse);
      break;
    default:
      break;
  }
}
