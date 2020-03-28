import UseCaseResponse from '../classes/UseCaseResponse';
import UseCaseInformation from '../classes/UseCaseInformation';

interface UseCaseConnector {
  useCaseName: String;
  /**
  * @function receiveMessage
  * @param {Arguments} arg -
  * @returns {Promise<>} - UseCaseResponse
  */
  receiveMessage(arg: UseCaseInformation|void): Promise<UseCaseResponse[]>;

  // Core Application calls this method on the UseCase to end & reset the UseCase
  resetUseCase(): void;
}
