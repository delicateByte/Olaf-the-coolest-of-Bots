import DailyFinancialStatus from './dfstatusUsecase';
import TextResponse from '../../classes/TextResponse';
import EndUseCaseResponse from '../../classes/EndUseCaseResponse';
import TelegramMessageType from '../../classes/TelegramMessageType';
import ExchangeratesResponse from '../../connectors/exchangerates/exchangeratesResponse';
import CoingeckoResponse from '../../connectors/coingecko/coingeckoResponse';
import Preferences from '../../core/preferences';

const googleAuthorize = jest.fn();
jest.mock('../../connectors/googleCalendar/googleCalendarAuthentication', () => ({
  default: jest.fn().mockImplementation(() => ({
    authorize: googleAuthorize,
  })),
}));

const exchangeratesGetCurrentStatus = jest.fn();
const exchangeratesGetCurrencies = jest.fn();
jest.mock('../../connectors/exchangerates/exchangeratesConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    getCurrentStatus: exchangeratesGetCurrentStatus,
    getCurrencies: exchangeratesGetCurrencies,
  })),
}));

const coingeckoGetCurrentStatus = jest.fn();
jest.mock('../../connectors/coingecko/coingeckoConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    getCurrentStatus: coingeckoGetCurrentStatus,
  })),
}));

jest.mock('../../core/preferences');

beforeEach(() => {
  jest.resetModules();
  googleAuthorize.mockReset();
  exchangeratesGetCurrentStatus.mockReset();
  exchangeratesGetCurrencies.mockReset();
  coingeckoGetCurrentStatus.mockReset();
});

test('receiving a telegram message', async () => {
  const dfStatus = new DailyFinancialStatus();
  const responses = await dfStatus.receiveMessage({
    originalMessage: undefined,
    type: TelegramMessageType.TEXT,
  });
  exchangeratesGetCurrentStatus.mockReturnValueOnce(
    new ExchangeratesResponse({
      CHF: 1.1207,
      JPY: 125.01,
      GBP: 0.85418,
      USD: 1.1219,
      CAD: 1.4987,
      HKD: 8.8062,
      ISK: 133.8,
      PHP: 58.637,
      DKK: 7.4639,
      HUF: 319.81,
      CZK: 25.693,
    },
    'EUR',
    '2020-04-04'),
  );
  exchangeratesGetCurrencies.mockReturnValueOnce(new ExchangeratesResponse({
    CHF: 1.1207,
    JPY: 125.01,
    GBP: 0.85418,
    USD: 1.1219,
  },
  'EUR',
  '2020-04-04'));
  coingeckoGetCurrentStatus.mockReturnValueOnce(new CoingeckoResponse('1234'));
  jest.spyOn(dfStatus, 'generateTextmessage').mockReturnValue('A message');

  expect((await responses.next()).value).toEqual(new TextResponse('Here\'s your financial update: '));
  expect((await responses.next()).value).toEqual(new TextResponse('A message'));
  expect((await responses.next()).value).toEqual(new EndUseCaseResponse());
});

test('proactive execution without calendar ID', async () => {
  const dfStatus = new DailyFinancialStatus();
  const responses = await dfStatus.receiveMessage(null);
  // @ts-ignore
  Preferences.get.mockReturnValueOnce('');

  expect((await responses.next()).value).toEqual(new TextResponse('No calendar ID specified in dashboard. Cannot check your calendar.'));
});

test('proactive execution with calendar ID - receive message', async () => {
  const dfStatus = new DailyFinancialStatus();
  const responses = await dfStatus.receiveMessage(null);
  // @ts-ignore
  Preferences.get.mockReturnValueOnce('anID@calendar.com');
  const spyAuthorizeClient = jest.spyOn(dfStatus, 'authorizeClient');

  expect((await responses.next()).value).toEqual(new EndUseCaseResponse());
  expect(spyAuthorizeClient).toHaveBeenCalled();
});

test('check for free time slots and send text message', async () => {
  const events = [{
    start: '2020-03-12T10:00:00.000Z',
    end: '2020-03-12T11:00:00.000Z',
  }, {
    start: '2020-03-12T12:00:00.000Z',
    end: '2020-03-12T13:00:00.000Z',
  }];
  // @ts-ignore
  Preferences.get.mockReturnValueOnce('11:30');
  const dfStatus = new DailyFinancialStatus();
  const responses = await dfStatus.checkAppointmentTimes(events);
  jest.spyOn(dfStatus, 'generateTextmessage').mockReturnValue('A message');

  expect((await responses.next()).value).toEqual(new TextResponse('A message'));
});

test('check without having events and send text message', async () => {
  const events = [];
  // @ts-ignore
  Preferences.get.mockReturnValueOnce('11:30');
  const dfStatus = new DailyFinancialStatus();
  const responses = await dfStatus.checkAppointmentTimes(events);
  jest.spyOn(dfStatus, 'generateTextmessage').mockReturnValue('A message');

  expect((await responses.next()).value).toEqual(new TextResponse('A message'));
});

test('check for free time slots and do not send text message', async () => {
  const events = [{
    start: '2020-03-12T07:00:00.000Z',
    end: '2020-03-12T16:00:00.000Z',
  }];
  // @ts-ignore
  Preferences.get.mockReturnValueOnce('11:30');
  const dfStatus = new DailyFinancialStatus();
  const responses = await dfStatus.checkAppointmentTimes(events);
  jest.spyOn(dfStatus, 'generateTextmessage').mockReturnValue('A message');

  expect((await responses.next()).value).toEqual(undefined);
});

test('create a text message', () => {
  const expected = 'Exchange rates for EUR are:\n\n💸  CHF: 1.1207\n💸  JPY: 125.01\n💸  GBP: 0.85418\n💸  USD: 1.1219\n\nBitcoin\'s current value: 1234€  💸';
  const actual = new DailyFinancialStatus().generateTextmessage({
    CHF: 1.1207,
    JPY: 125.01,
    GBP: 0.85418,
    USD: 1.1219,
  }, {
    eur: 1234,
  }, ['CHF', 'JPY', 'GBP', 'USD']);
  expect(actual).toEqual(expected);
});

test('reset', () => {
  expect(new DailyFinancialStatus().reset()).toBeUndefined();
});
