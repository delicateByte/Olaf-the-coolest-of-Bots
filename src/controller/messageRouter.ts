// Import UseCases
// Import 1
//Import 2
// Import 3
// Import 4
// Import 5
import { MessageHandler } from "./messageHandler"
import * as BrainState from "./brainState"
import { UseCaseInformation } from "../classes/UseCaseInformation";
import { MessageResponseType } from "../classes/messageResponseTypeEnum";



export function extractUseCase(telegramMessageContent) {

}
export function routeMessageToUseCase(message: UseCaseInformation) {

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
    default:
      break;
  }
}
