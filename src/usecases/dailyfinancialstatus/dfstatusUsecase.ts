import UseCase from '../../interfaces/useCase';
import UseCaseResponse from '../../classes/UseCaseResponse';
import TextResponse from '../../classes/TextResponse';
// import Preferneces from '../../core/preferences';
import EndUseCaseResponse from '../../classes/EndUseCaseResponse';
import ProcessedTelegramMessage from '../../classes/ProcessedTelegramMessage';
import ExchangeRatesConnector from '../../connectors/exchangerates/exchangeratesConnector';
import CoinGeckoConnector from '../../connectors/coingecko/coingeckoConnector';

const fs = require('fs');
const gcAuthentication = require('../../connectors/googleCalendar/googleCalendarAuthentication.ts');

class DailyFinancialStatus implements UseCase {
  name = 'Daily financial status';
  triggers = ['financial', 'finance', 'finances'];

  private exchangeRates = new ExchangeRatesConnector();
  private coinGecko = new CoinGeckoConnector();

  // constructor() {
  // }

  // eslint-disable-next-line class-methods-use-this
  async* receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    if (message) {
      yield new TextResponse('Here\'s a response');
      console.log('Done.');
    }

    yield new EndUseCaseResponse();
  }

  // eslint-disable-next-line class-methods-use-this
  public checkForEvents() {
    fs.readFile('../../../credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Calendar API.
      gcAuthentication.authorize(JSON.parse(content), this.listEvents);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public listEvents(auth) {
    const calendar = gcAuthentication.google.calendar({ version: 'v3', auth });
    const calendarID = 'k.sonja1999@gmail.com';

    const startDate = new Date().getDate();
    const startMonth = new Date().getMonth();
    const startYear = new Date().getFullYear();
    const startHour = 0;
    const startMinute = 0;
    console.log(startDate, startMonth, startYear);

    calendar.freebusy.query({
      auth,
      resource: {
        timeMin: (new Date(startYear, startMonth, startDate, startHour, startMinute)).toISOString(),
        // eslint-disable-next-line max-len
        timeMax: (new Date(startYear, startMonth, startDate, startHour + 28, startMinute)).toISOString(),
        items: [{ id: calendarID }],
      },
    })
      .then((answer) => {
        const busyEvents = answer.data.calendars[calendarID].busy;
        // busy object is empty if there are no appointments or only all-day events
        console.log(answer.data);
        console.log(busyEvents);
      // if array is not empty: iterate over elements
      // check if one of its times equals preference time
      // if so, check for the events end time
      // reschedule information to end time of event
      });
  }

  // eslint-disable-next-line class-methods-use-this
  reset(): void { }
}

export default DailyFinancialStatus;

// const axios = require('axios');

// const urlInitER = 'https://api.exchangeratesapi.io';
// const urlInitCG = 'https://api.coingecko.com/api/v3';

// const favCurrenciesER = ['USD', 'JPY', 'GBP', 'CHF'];
// const favCurrenciesCG = ['eur'];

// function fetchDataFrom(apiUrl) {
//   const newRequest = axios.get(apiUrl);
//   return newRequest;
// }

// function checkStatusCode(rawResponse) {
//   if (rawResponse.status === 200) {
//     // console.log('Status is OK.');
//     return Promise.resolve(rawResponse);
//   } if (rawResponse.status === 404) {
//     throw new Error('Content was not found.');
//   } else {
//     throw new Error(`Error occured - status: ${rawResponse.status}`);
//   }
// }

// function arrayContainsKey(array, key) {
//   for (let i = 0; i < array.length; i += 1) {
//     if (array[i] === key) {
//       return true;
//     }
//   }
//   return false;
// }

// function getCurrenciesER(responseAllCurrencies, requiredCurrencies) {
//   const result = {};
//   Object.keys(responseAllCurrencies.rates).forEach((key) => {
//     if (arrayContainsKey(requiredCurrencies, key)) {
//       result[key] = responseAllCurrencies.rates[key];
//     }
//   });
//   return result;
// }

// function getCurrenciesCG(responseAllCurrencies, requiredCurrencies) {
//   const result = {};
//   Object.keys(responseAllCurrencies.bitcoin).forEach((key) => {
//     if (arrayContainsKey(requiredCurrencies, key)) {
//       result[key] = responseAllCurrencies.bitcoin[key];
//     }
//   });
//   return result;
// }

// exports.urlInitER = urlInitER;
// exports.urlInitCG = urlInitCG;
// exports.fetchDataFrom = fetchDataFrom;
// exports.checkStatusCode = checkStatusCode;
// exports.arrayContainsKey = arrayContainsKey;
// exports.getCurrenciesER = getCurrenciesER;
// exports.getCurrenciesCG = getCurrenciesCG;

// // most recent data (exchange rate for 1 euro to all other currencies) from exchangerates API
// fetchDataFrom(`${urlInitER}/latest`)
//   .then((receivedResponse) => checkStatusCode(receivedResponse))
//   .then((allcurrencies) => getCurrenciesER(allcurrencies.data, favCurrenciesER))
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

// // most recent data (value of 1 bitcoin in euro) from Coin Gecko API
// fetchDataFrom(`${urlInitCG}/simple/price?ids=bitcoin&vs_currencies=eur`)
//   .then((receivedResponse) => checkStatusCode(receivedResponse))
//   .then((allcurrencies) => getCurrenciesCG(allcurrencies.data, favCurrenciesCG))
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));
