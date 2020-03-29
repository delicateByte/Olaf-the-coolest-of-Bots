import MessageRouter from './messageRouter';
import ProcessedTelegramMessage from '../classes/ProcessedTelegramMessage';
import UseCase from '../interfaces/useCase';
import TelegramMessageType from '../classes/TelegramMessageType';

function getMockUseCase(name: string, triggers: string[]): UseCase {
  return {
    name,
    triggers,
    receiveMessage: async () => [],
    reset(): void {},
  };
}

function getTelegramTextMessage(text: string): ProcessedTelegramMessage {
  return {
    originalMessage: null,
    type: TelegramMessageType.TEXT,
    text,
  };
}

test('get use case by trigger phrase', () => {
  const router = new MessageRouter();
  const fooUseCase = getMockUseCase('Foo Use Case', ['foo']);
  const barUseCase = getMockUseCase('Bar Use Case', ['bar', 'mango']);
  router.registerUseCase(fooUseCase);
  router.registerUseCase(barUseCase);

  expect(fooUseCase).not.toBe(barUseCase);
  expect(router.findUseCaseByTrigger(getTelegramTextMessage('foo'))).toBe(fooUseCase);
  expect(router.findUseCaseByTrigger(getTelegramTextMessage('bar'))).toBe(barUseCase);
  expect(router.findUseCaseByTrigger(getTelegramTextMessage('mango'))).toBe(barUseCase);
  expect(() => router.findUseCaseByTrigger(getTelegramTextMessage('other'))).toThrow();
});

test('get use case by name', () => {
  const router = new MessageRouter();
  const fooUseCase = getMockUseCase('Foo Use Case', []);
  const barUseCase = getMockUseCase('Bar Use Case', []);
  router.registerUseCase(fooUseCase);
  router.registerUseCase(barUseCase);

  expect(fooUseCase).not.toBe(barUseCase);
  expect(router.findUseCaseByName('Foo Use Case')).toBe(fooUseCase);
  expect(router.findUseCaseByName('foo use case')).toBe(fooUseCase);
  expect(router.findUseCaseByName('foousecase')).toBe(fooUseCase);
  expect(router.findUseCaseByName('bar use case')).toBe(barUseCase);
  expect(router.findUseCaseByName('other use case')).toBeNull();
});
