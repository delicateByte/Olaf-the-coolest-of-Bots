import UseCase from '../interfaces/useCase';

class BrainState {
  chatId:number;

  interruptedUseCase:Boolean;

  activeUseCase: UseCase;
}
export default BrainState;
