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

test('create a text message', () => {
  const emoji = String.fromCodePoint(0x1F4B8);
  const expected = `Exchange rates for EUR are:\n\n${emoji}  CHF: 1.1207\n${emoji}  JPY: 125.01\n${emoji}  GBP: 0.85418\n${emoji}  USD: 1.1219\n\nBitcoin's current value: 1234€  ${emoji}`;
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
