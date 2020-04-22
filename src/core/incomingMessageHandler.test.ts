import IncomingMessageHandler from './incomingMessageHandler';
import TelegramMessageType from '../classes/TelegramMessageType';


jest.mock('../connectors/speechToText/speechToTextConnector', () => ({
  default: jest.fn().mockReturnValue({
    recognize: () => 'foo bar',
  }),
}));
const mockTelegramBot = { getFileStream: () => null };

test('test text message', async () => {
  const handler = new IncomingMessageHandler(null);

  const expectedText = 'foo bar';
  const actual = await handler.extractAndProcessMessage({
    text: expectedText,
  });
  expect(actual.text).toBe(expectedText);
  expect(actual.latitude).toBeUndefined();
  expect(actual.longitude).toBeUndefined();
  expect(actual.type).toBe(TelegramMessageType.TEXT);
});

test('test location message', async () => {
  const handler = new IncomingMessageHandler(null);

  const expectedLocation = { latitude: 42.00, longitude: 42.42 };
  const actual = await handler.extractAndProcessMessage({
    location: expectedLocation,
  });
  expect(actual.latitude).toBe(expectedLocation.latitude);
  expect(actual.longitude).toBe(expectedLocation.longitude);
  expect(actual.text).toBeUndefined();
  expect(actual.type).toBe(TelegramMessageType.LOCATION);
});

test('test voice message', async () => {
  // @ts-ignore
  const handler = new IncomingMessageHandler(mockTelegramBot);

  const expectedText = 'foo bar';
  const actual = await handler.extractAndProcessMessage({
    voice: { file_id: 'abc123' },
  });
  expect(actual.text).toBe(expectedText);
  expect(actual.latitude).toBeUndefined();
  expect(actual.longitude).toBeUndefined();
  expect(actual.type).toBe(TelegramMessageType.VOICE);
});

test('test unsupported message type', async () => {
  // @ts-ignore
  const handler = new IncomingMessageHandler(mockTelegramBot);

  const actual = handler.extractAndProcessMessage({
    photo: null,
  });
  expect(actual).rejects.toThrow();
});
