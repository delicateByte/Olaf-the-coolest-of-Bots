import UseCaseEnum from './UseCaseEnum';

class BrainState {
  chatId:number;

  interruptedUseCase:Boolean;

  activeUseCase:UseCaseEnum;
}
export default BrainState;
