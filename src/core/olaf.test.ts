import { CronJob } from 'cron';

import Olaf from './olaf';
import TextResponse from '../classes/TextResponse';
import MessageSender from './messageSender';
import MessageRouter from './messageRouter';
import Preferences from './preferences';
import EndUseCaseResponse from '../classes/EndUseCaseResponse';

jest.mock('node-telegram-bot-api');
jest.mock('cron');
jest.mock('./incomingMessageHandler');
jest.mock('./messageRouter');
jest.mock('./messageSender');
jest.mock('./preferences');

process.env.BOT_TOKEN = null;


beforeEach(() => {
  jest.resetModules();
});

test('starting', () => {
  const preferencesChangedFunction = jest.fn();
  // @ts-ignore
  Preferences.events = () => ({
    on: preferencesChangedFunction,
  });

  const olaf = new Olaf();

  olaf.start();

  // @ts-ignore
  expect(olaf.telegramBot.on).toHaveBeenCalled();
  expect(preferencesChangedFunction).toHaveBeenCalled();
});

test('extract Telegram message', async () => {
  const olaf = new Olaf();
  const message = { message_id: 12345, chat: { id: 54321 } };

  // @ts-ignore
  await olaf.handleTelegramMessage(message);

  // @ts-ignore
  expect(olaf.messageSender.setChatId).toHaveBeenCalledWith(54321);
  // @ts-ignore
  expect(olaf.messageHandler.extractAndProcessMessage).toHaveBeenCalledWith(message);
});

describe('run use case', () => {
  test('that throws an exception', async () => {
    const olaf = new Olaf();

    // @ts-ignore
    olaf.getResponses = jest.fn().mockImplementation(() => { throw new Error('some error'); });
    // @ts-ignore
    await olaf.runUseCase(null);

    // @ts-ignore
    expect(olaf.messageSender.sendResponse).toHaveBeenCalledWith(new TextResponse('Error: some error'));
  });

  test('and subsequent proactive use case in queue', async () => {
    const useCase = {
      reset: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      async* receiveMessage() {},
    };
    // @ts-ignore
    MessageSender.mockImplementation(() => ({
      sendResponses: jest.fn(async (gen) => {
        // eslint-disable-next-line no-restricted-syntax,@typescript-eslint/no-unused-vars
        for await (const unused of gen);
        return true;
      }),
    }));
    // @ts-ignore
    MessageRouter.mockImplementation(() => ({
      registerUseCase: jest.fn(),
      findUseCaseByTrigger: jest.fn().mockReturnValue(useCase),
    }));

    const olaf = new Olaf();
    // @ts-ignore
    olaf.proactiveQueue = [useCase];

    // @ts-ignore
    await olaf.runUseCase(null);

    // @ts-ignore
    expect(olaf.activeUseCase).toBeNull();
    // @ts-ignore
    expect(olaf.proactiveQueue).toEqual([]);
  });
});

describe('sending command', () => {
  test('start', async () => {
    const olaf = new Olaf();

    // @ts-ignore
    const responses = olaf.getResponses({ text: '/start' });

    expect((await responses.next()).value.text.includes('Say Hi to Olaf')).toBeTruthy();
    expect((await responses.next()).value).toBeDefined();
  });

  test('help', async () => {
    const olaf = new Olaf();

    // @ts-ignore
    const responses = olaf.getResponses({ text: '/help' });

    expect((await responses.next()).value).toBeDefined();
  });

  test('help', async () => {
    const olaf = new Olaf();

    // @ts-ignore
    const responses = olaf.getResponses({ text: '/settings' });

    expect((await responses.next()).value.text.includes('Personalize Olaf')).toBeTruthy();
  });

  test('stop when there is an active one', async () => {
    const olaf = new Olaf();
    // @ts-ignore
    olaf.activeUseCase = {};

    // @ts-ignore
    const responses = olaf.getResponses({ text: '/stop' });

    expect((await responses.next()).value).toEqual(new TextResponse('Use case stopped'));
    expect((await responses.next()).value).toEqual(new EndUseCaseResponse());
  });

  test('stop when there is an active one', async () => {
    const olaf = new Olaf();

    // @ts-ignore
    const responses = olaf.getResponses({ text: '/stop' });

    expect((await responses.next()).value).toEqual(new TextResponse('No active use case'));
  });

  test('help', async () => {
    const olaf = new Olaf();

    // @ts-ignore
    const responses = olaf.getResponses({ text: '/unrecognized' });

    expect(responses.next()).rejects.toEqual(new Error('Unrecognized command'));
  });
});

test('scheduling of proactive use cases', async () => {
  const olaf = new Olaf();

  const stopFunction = jest.fn();
  // @ts-ignore
  olaf.proactiveJobs = { service: { stop: stopFunction } };

  // @ts-ignore
  Preferences.get.mockReturnValueOnce(true);
  // @ts-ignore
  Preferences.get.mockReturnValueOnce('08:00');

  // @ts-ignore
  olaf.scheduleProactivity('service');

  expect(stopFunction).toHaveBeenCalled();
  // @ts-ignore
  expect(olaf.proactiveJobs.service.start).toHaveBeenCalled();
  expect(CronJob.mock.calls[0][0]).toEqual('0 00 08 * * *');
});
