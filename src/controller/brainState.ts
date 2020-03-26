import BrainState from '../classes/BrainStateClass';

const state = new BrainState();
state.chatId = 857438551;

export function interruptUseCase() {
  state.interruptedUseCase = true;
}
export function reset() {
  state.interruptedUseCase = false;
}
export function activateUseCase(selectedUsecase) {
  state.activeUseCase = selectedUsecase;
}
export function setChatId(newChatId) {
  state.chatId = newChatId;
}
export function getChatId() {
  return state.chatId;
}
