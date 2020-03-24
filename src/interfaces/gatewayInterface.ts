import { UseCaseResponse } from "../classes/UseCaseResponse";

interface UseCaseConnector {
  useCaseName: String;
  /**
  * @function recieveMessage
  * @param {Arguments} arg -
  * @returns {Promise<>} - UseCaseResonse
  */
  recieveMessage(arg: any): Promise<UseCaseResponse[]>;

  // Core Application calls this method on the Usecase to end & reset the usecase
  resetUseCase(): void;
}
