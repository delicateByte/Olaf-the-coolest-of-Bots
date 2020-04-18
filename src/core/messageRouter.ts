import ProcessedTelegramMessage from '../classes/ProcessedTelegramMessage';
import UseCase from '../interfaces/useCase';
import TelegramMessageType from '../classes/TelegramMessageType';

class MessageRouter {
  private useCases: UseCase[] = [];

  registerUseCase(useCase: UseCase): void {
    this.useCases.push(useCase);
  }

  findUseCaseByTrigger(message: ProcessedTelegramMessage): UseCase {
    // Returns Michis use case directly when a location is sent by the user
    if (message.type === TelegramMessageType.LOCATION) {
      for (const useCase of this.useCases) {
        if (useCase.name === 'Translator') {
          return useCase;
        }
      }
    }

    // Check if one of the trigger phrases of any use case is included in the message text
    // eslint-disable-next-line no-restricted-syntax
    for (const useCase of this.useCases) {
      if (useCase.triggers.some((phrase) => message.text?.toLowerCase().includes(phrase))) {
        return useCase;
      }
    }

    throw new Error('Invalid use case');
  }

  findUseCaseByName(name: string): UseCase {
    // Remove spaces and convert to lower case
    const unify = (t: string) => t.replace(/\s/g, '').toLowerCase();
    return this.useCases.find((useCase) => unify(useCase.name) === unify(name)) || null;
  }
}
export default MessageRouter;
