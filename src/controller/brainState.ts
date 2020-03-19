export const UseCases = { "News": 1, "Entertainment": 2, "DailyRoutine": 3 }
Object.freeze(UseCases)

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
