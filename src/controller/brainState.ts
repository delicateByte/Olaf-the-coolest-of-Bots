export const UseCases = { "News": 1, "Entertainment": 2, "DailyRoutine": 3 }
Object.freeze(UseCases)
let chatId = 857438551;
export var interruptedUseCase = false;
export var activeUseCase;

export function interruptUseCase() {
  interruptedUseCase = true;
}
export function reset() {
  interruptedUseCase = false;
}
export function activateUseCase(selectedUsecase) {
  activeUseCase = selectedUsecase;
}
export function setChatId(newChatId) {
  chatId = newChatId;
}
export function getChatId() {
  return chatId;
}
