import UseCaseResponse from '../classes/UseCaseResponse';
import TelegramMessage from '../classes/TelegramMessage';

interface UseCase {
  readonly name: string;
  readonly triggers: string[];

  receiveMessage(message: TelegramMessage): Promise<UseCaseResponse[]>;

  // Core application calls this method to end and reset the UseCase
  reset(): void;
}
export default UseCase;
