import UseCaseResponse from '../classes/UseCaseResponse';

interface UseCaseConnector {
  useCaseName: String;
  /**
  * @function recieveMessage
  * @param {Arguments} arg -
  * @returns {Promise<>} - UseCaseResponse
  */
  recieveMessage(arg: any): Promise<UseCaseResponse[]>;

  // Core Application calls this method on the UseCase to end & reset the UseCase
  resetUseCase(): void;
}
