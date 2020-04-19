import axios from 'axios';

import ExchangeratesConnector from './exchangeratesConnector';
import ExchangeratesResponse from './exchangeratesResponse';

jest.mock('axios');

function getMockConnector(response): ExchangeratesConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: response }),
  });
  return new ExchangeratesConnector();
}

test('get all recent currencies from exchangerates API', async () => {
  const expected = new ExchangeratesResponse({
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
  '2020-04-04');
  const actual = await getMockConnector({
    rates: expected.rates,
    base: expected.base,
    date: expected.date,
  }).getCurrentStatus();

  expect(actual).toEqual(expected);
});

test('retrieve specified currencies from all', () => {
  const expected = {
    CHF: 1.1207,
    JPY: 125.01,
    GBP: 0.85418,
    USD: 1.1219,
  };
  const actual = getMockConnector({}).getCurrencies(new ExchangeratesResponse({
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
  '2020-04-04'));
  expect(actual).toEqual(expected);
});
