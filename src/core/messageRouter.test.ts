import MessageRouter from './messageRouter';
import TelegramMessage from '../classes/TelegramMessage';
import UseCaseResponse from '../classes/UseCaseResponse';
import UseCase from '../interfaces/useCase';
import TelegramMessageType from '../classes/TelegramMessageType';

function getMockUseCase(name: string, triggers: string[]): UseCase {
  return {
    name,
    triggers,
    receiveMessage(message: TelegramMessage): Promise<UseCaseResponse[]> {
      return null;
    },
    reset(): void { },
  };
}

function getTelegramTextMessage(text: string): TelegramMessage {
  return {
    originalMessage: null,
    type: TelegramMessageType.TEXT,
    text,
  };
}

test('trigger works', () => {
  const router = new MessageRouter();
  const fooUseCase = getMockUseCase('Foo Use Case', ['foo']);
  const barUseCase = getMockUseCase('Bar Use Case', ['bar', 'mango']);
  router.registerUseCase(fooUseCase);
  router.registerUseCase(barUseCase);

  expect(fooUseCase).not.toBe(barUseCase);
  expect(router.findUseCaseByTrigger(getTelegramTextMessage('foo'))).toBe(fooUseCase);
  expect(router.findUseCaseByTrigger(getTelegramTextMessage('bar'))).toBe(barUseCase);
  expect(router.findUseCaseByTrigger(getTelegramTextMessage('mango'))).toBe(barUseCase);
  expect(router.findUseCaseByTrigger(getTelegramTextMessage('other'))).toBeNull();
});
