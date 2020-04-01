const dfStatus = require('../df_status');
const mockResults = require('./mock_results');

test('get JSON response for results of 09th March 2020 from currencyexchange API', () => dfStatus.fetchDataFrom(`${dfStatus.urlInitER}/2020-03-09`)
  .then((data) => dfStatus.parseToJSON(data))
  .then((result) => expect(result).toStrictEqual(mockResults.ratesDefault2020March09)));

test('get response from Coin Gecko API', () => dfStatus.fetchDataFrom(`${dfStatus.urlInitCG}/ping`)
  .then((data) => dfStatus.parseToJSON(data))
  .then((result) => expect(result).toStrictEqual(mockResults.coinGeckoPing)));

test('check if array contains a value', () => {
  expect(dfStatus.arrayContainsKey(['a', 'b', 'c', 'd'], 'c')).toBe(true);
});

test('check if array does not contain a value', () => {
  expect(dfStatus.arrayContainsKey(['a', 'b', 'c', 'd'], 'e')).toBe(false);
});

test('check retrival of specific currencies currencyexchange API', () => {
  expect(dfStatus.getCurrenciesER(mockResults.ratesDefault2020March09, mockResults.favCurrenciesER))
    .toStrictEqual({
      JPY: 117.12, CHF: 1.0594, USD: 1.1456, GBP: 0.87383,
    });
});

test('check retrival of specific currencies Coin Gecko API', () => {
  expect(dfStatus.getCurrenciesCG(mockResults.coinGeckoMockResponse, mockResults.favCurrenciesCG))
    .toStrictEqual({
      eur: 6575.43,
    });
});
