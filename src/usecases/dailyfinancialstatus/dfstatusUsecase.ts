/* eslint-disable consistent-return */
import UseCase from '../../interfaces/useCase';
import UseCaseResponse from '../../classes/UseCaseResponse';
import TextResponse from '../../classes/TextResponse';
import Preferences from '../../core/preferences';
import EndUseCaseResponse from '../../classes/EndUseCaseResponse';
import ProcessedTelegramMessage from '../../classes/ProcessedTelegramMessage';
import ExchangeRatesConnector from '../../connectors/exchangerates/exchangeratesConnector';
import CoinGeckoConnector from '../../connectors/coingecko/coingeckoConnector';

const fs = require('fs');
const path = require('path');
const gcAuthentication = require('../../connectors/googleCalendar/googleCalendarAuthentication.ts');

class DailyFinancialStatus implements UseCase {
  name = 'dfstatus';
  triggers = ['financial', 'finance', 'finances'];

  private exchangeRates = new ExchangeRatesConnector();
  private coinGecko = new CoinGeckoConnector();

  // constructor() {
  // }

  async* receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    if (message) {
      yield new TextResponse('Here\'s your financial update: ');
    }
    this.checkForEvents();
    const allClassicRates = await this.exchangeRates.getCurrentStatus();
    const classicRates = await this.exchangeRates.getCurrencies(allClassicRates);
    const bitcoinRate = await this.coinGecko.getCurrentStatus();

    yield new TextResponse(this.generateTextmessage(classicRates, bitcoinRate));

    yield new EndUseCaseResponse();
  }

  public checkForEvents() {
    console.log(__dirname);
    fs.readFile(path.resolve(__dirname, '../../../credentials.json'), (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Calendar API.
      gcAuthentication.authorize(JSON.parse(content), this.listEvents);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public listEvents(auth) {
    const calendar = gcAuthentication.google.calendar({ version: 'v3', auth });
    // const calendarID = 'k.sonja1999@gmail.com';
    const calendarID = Preferences.get('dfstatus', 'dfstatusCalendarID');

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

        const preferenceTime = Preferences.get('dfstatus', 'dfstatusProactiveTime');
        console.log(preferenceTime);
      //
      // if array is not empty: iterate over elements
      // check if one of its times equals preference time
      // if so, check for the events end time
      // abort use case and don't send message if there is a collision to an appointment
      });
  }

  private generateTextmessage(classicRates, bitcoinRate): string {
    const money = String.fromCodePoint(0x1F4B8);
    let text = '';
    text += 'Exhange rates for EUR are:\n\n';
    this.exchangeRates.currencies.forEach((key) => {
      text += `${money}  ${key}: ${classicRates[key]}\n`;
    });
    text += `\nBitcoin's current value: ${bitcoinRate.eur}€  ${money}`;
    return text;
  }

  // eslint-disable-next-line class-methods-use-this
  reset(): void { }
}

export default DailyFinancialStatus;
