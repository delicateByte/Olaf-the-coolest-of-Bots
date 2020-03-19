const ratesDefault2020March09 = {
  rates: {
    CAD: 1.5613,
    HKD: 8.9041,
    ISK: 145.0,
    PHP: 58.013,
    DKK: 7.4695,
    HUF: 336.25,
    CZK: 25.504,
    AUD: 1.733,
    RON: 4.8175,
    SEK: 10.7203,
    IDR: 16488.05,
    INR: 84.96,
    BRL: 5.4418,
    RUB: 85.1553,
    HRK: 7.55,
    JPY: 117.12,
    THB: 36.081,
    CHF: 1.0594,
    SGD: 1.5841,
    PLN: 4.3132,
    BGN: 1.9558,
    TRY: 7.0002,
    CNY: 7.96,
    NOK: 10.89,
    NZD: 1.8021,
    ZAR: 18.2898,
    USD: 1.1456,
    MXN: 24.3268,
    ILS: 4.0275,
    GBP: 0.87383,
    KRW: 1374.71,
    MYR: 4.8304,
  },
  base: 'EUR',
  date: '2020-03-09',
};

const coinGeckoPing = {
  gecko_says: '(V3) To the Moon!',
};

const coinGeckoMockResponse = {
  bitcoin: {
    eur: 6575.43,
  },
};

const favCurrenciesER = ['USD', 'JPY', 'GBP', 'CHF'];

const favCurrenciesCG = ['eur'];

exports.ratesDefault2020March09 = ratesDefault2020March09;
exports.coinGeckoPing = coinGeckoPing;
exports.coinGeckoMockResponse = coinGeckoMockResponse;
exports.favCurrenciesER = favCurrenciesER;
exports.favCurrenciesCG = favCurrenciesCG;
