// Import UseCases
// Import 1
//Import 2
// Import 3
// Import 4
// Import 5
import { MessageHandler } from "./messageHandler"
import * as BrainState from "./brainState"




export function extractUseCase(telegramMessageContent) {

}
export function routeMessages() {
  if (!BrainState.interruptUseCase) {


  } else {
    BrainState.reset();
  }

}

export function useCaseResponse(useCaseResponse) {
  switch (useCaseResponse) {
    case MessageResponseType.text:
      MessageHandler.sendTextMessage(useCaseResponse)
      break;
    case MessageResponseType.voice:
      MessageHandler.sendAudioMessage(useCaseResponse)
      break;
    case MessageResponseType.location:
      MessageHandler.sendLocationMessage(useCaseResponse)
      break;
    case MessageResponseType.picture:
      MessageHandler.sendImageMessage(useCaseResponse)
      break;
    case MessageResponseType.video:
      MessageHandler.sendVideoMessage(useCaseResponse)
      break;
    default:
      break;
  }
}

function sendMessageToUser() {

}
