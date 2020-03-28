import UseCaseResponse from '../classes/UseCaseResponse';
import TelegramMessage from '../classes/TelegramMessage';

interface UseCase {
  readonly useCaseName: string;

  receiveMessage(arg: TelegramMessage | void): Promise<UseCaseResponse[]>;

  // Core Application calls this method on the UseCase to end & reset the UseCase
  resetUseCase(): void;
}
export default UseCase;
