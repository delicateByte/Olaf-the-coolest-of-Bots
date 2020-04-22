import * as TelegramBot from 'node-telegram-bot-api';
import MessageSender from './messageSender';
import EndUseCaseResponse from '../classes/EndUseCaseResponse';
import TextResponse from '../classes/TextResponse';
import LocationResponse from '../classes/LocationResponse';
import VoiceResponse from '../classes/VoiceResponse';
import ImageResponse from '../classes/ImageResponse';

jest.mock('../connectors/textToSpeech/textToSpeechConnector', () => ({
  default: jest.fn().mockReturnValue({
    synthesize: () => 'path/to/audio.ogg',
  }),
}));

jest.mock('node-telegram-bot-api');
let telegramBot;

function fakeGenerateAsync(array: any[]): any[] {
  // jest does not seem to support AsyncGenerators
  return array.map((e) => Promise.resolve(e));
}

beforeEach(() => {
  // @ts-ignore
  telegramBot = new TelegramBot();
});

test('set chat id', async () => {
  const sender = new MessageSender(telegramBot);
  sender.setChatId(12345);

  // @ts-ignore
  expect(sender.chatId).toBe(12345);
});

test('end use case', async () => {
  const sender = new MessageSender(telegramBot);

  // @ts-ignore
  const actual = await sender.sendResponses(fakeGenerateAsync([new EndUseCaseResponse()]));
  expect(actual).toBe(true);
});

test('send no response', async () => {
  const sender = new MessageSender(telegramBot);

  // @ts-ignore
  const actual = await sender.sendResponses(fakeGenerateAsync([]));
  expect(actual).toBe(false);
});

test('send text responses', async () => {
  const sender = new MessageSender(telegramBot);

  // @ts-ignore
  await sender.sendResponse(new TextResponse('foobar'));
  expect(telegramBot.sendMessage.mock.calls[0][1]).toBe('foobar');
});

test('send voice responses', async () => {
  const sender = new MessageSender(telegramBot);

  // @ts-ignore
  await sender.sendResponse(new VoiceResponse('barfoo'));
  expect(telegramBot.sendVoice.mock.calls[0][1]).toBe('path/to/audio.ogg');
});

test('send location responses', async () => {
  const sender = new MessageSender(telegramBot);

  // @ts-ignore
  await sender.sendResponse(new LocationResponse(42.00, 42.42));
  expect(telegramBot.sendLocation.mock.calls[0][1]).toBe(42.00);
  expect(telegramBot.sendLocation.mock.calls[0][2]).toBe(42.42);
});

test('send image responses', async () => {
  const sender = new MessageSender(telegramBot);

  // @ts-ignore
  await sender.sendResponse(new ImageResponse('path/to/image.png'));
  expect(telegramBot.sendPhoto.mock.calls[0][1]).toBe('path/to/image.png');
});
