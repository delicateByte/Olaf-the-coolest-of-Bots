import UseCaseResponse from '../classes/UseCaseResponse';
import ProcessedTelegramMessage from '../classes/ProcessedTelegramMessage';

/**
 * Interface that every use case needs to implement so it can be called by the main application
 */
interface UseCase {
  /**
   * The use case name as it appears in the preferences
   */
  readonly name: string;

  /**
   * The list of trigger phrases that will have a message routed to this use case
   */
  readonly triggers: string[];

  /**
   * Receives a Telegram message from core application, handles it and creates appropriate responses
   * @param {ProcessedTelegramMessage} message - The processed Telegram message, or null if the use case
   * was triggered proactively without user interaction.
   * @returns {Promise<UseCaseResponse[]>} The responses that will be sent to the user. Must include
   * an {@link EndUseCaseResponse} if the use case is finished.
   */
  receiveMessage(message: ProcessedTelegramMessage): Promise<UseCaseResponse[]>;

  /**
   * Called by the core application to end and reset a use case
   * Triggered when:
   * - {@link EndUseCaseResponse} is returned in {@link receiveMessage}
   * - user sends stop command
   */
  reset(): void;
}
export default UseCase;
