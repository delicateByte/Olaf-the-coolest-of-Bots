import axios from 'axios';

import CoingeckoConnector from './coingeckoConnector';
import CoingeckoResponse from './coingeckoResponse';

jest.mock('axios');

function getMockConnector(response): CoingeckoConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: response }),
  });
  return new CoingeckoConnector();
}

test('get bitcoin price from coingecko API', async () => {
  const expected = new CoingeckoResponse('1234');
  const actual = await getMockConnector({
    bitcoin: {
      eur: expected.eur,
    },
  }).getCurrentStatus();

  expect(actual).toEqual(expected);
});
