import * as moment from 'moment';

import UseCase from '../../interfaces/useCase';
import UseCaseResponse from '../../classes/UseCaseResponse';
import TextResponse from '../../classes/TextResponse';
import Preferences from '../../core/preferences';
import EndUseCaseResponse from '../../classes/EndUseCaseResponse';
import ProcessedTelegramMessage from '../../classes/ProcessedTelegramMessage';
import ExchangeRatesConnector from '../../connectors/exchangerates/exchangeratesConnector';
import CoinGeckoConnector from '../../connectors/coingecko/coingeckoConnector';

const fs = require('fs').promises;
const path = require('path');
const gcAuthentication = require('../../connectors/googleCalendar/googleCalendarAuthentication.ts');

class DailyFinancialStatus implements UseCase {
  name = 'dfstatus';
  triggers = ['financial', 'finance', 'finances'];

  private exchangeRates = new ExchangeRatesConnector();
  private coinGecko = new CoinGeckoConnector();
  private classicRates;
  private bitcoinRate;
  private requiredCurrencies;

  constructor() {
    this.requiredCurrencies = this.exchangeRates.currencies;
  }

  async* receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    const allClassicRates = await this.exchangeRates.getCurrentStatus();
    this.classicRates = this.exchangeRates.getCurrencies(allClassicRates);
    this.bitcoinRate = await this.coinGecko.getCurrentStatus();

    if (message) {
      yield new TextResponse('Here\'s your financial update: ');
      yield new TextResponse(this.generateTextmessage(
        this.classicRates, this.bitcoinRate, this.requiredCurrencies,
      ));
    } else if (Preferences.get('dfstatus', 'dfstatusCalendarID') === '') { // proactive case
      yield new TextResponse('No calendar ID specified in dashboard. Cannot check your calendar.');
    } else {
      yield* this.authorizeClient();
    }
    yield new EndUseCaseResponse();
  }

  public async* authorizeClient() {
    try {
      // Authorize a client with credentials, then call the Google Calendar API.
      const content = await fs.readFile(path.resolve(__dirname, '../../../credentials.json'));
      const auth = await new Promise(((resolve) => {
        gcAuthentication.authorize(JSON.parse(content), (res) => resolve(res));
      }));
      yield* this.retrieveEvents(auth);
    } catch (err) {
      console.log('Error loading client secret file');
    }
  }

  async* retrieveEvents(auth) {
    const calendar = gcAuthentication.google.calendar({ version: 'v3', auth });
    const calendarID = Preferences.get('dfstatus', 'dfstatusCalendarID');
    const start = moment().startOf('day');
    const end = moment(start).add(1, 'day');

    const answer = await calendar.freebusy.query({
      auth,
      resource: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: calendarID }],
      },
    });
    // busyEvents do not consider time zone - still UTC!
    const busyEvents = answer.data.calendars[calendarID].busy;
    yield* this.checkAppointmentTimes(busyEvents);
  }

  async* checkAppointmentTimes(busyEvents): AsyncGenerator<UseCaseResponse> {
    const now = moment();
    const isFree = !busyEvents.some((event) => {
      const start = moment.utc(event.start);
      const end = moment.utc(event.end);
      return now.isBetween(start, end, 'minute', '[]');
    });
    if (isFree) {
      yield new TextResponse(this.generateTextmessage(
        this.classicRates, this.bitcoinRate, this.exchangeRates.currencies,
      ));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  generateTextmessage(classicRates, bitcoinRate, requiredCurrencies): string {
    let text = '';
    text += 'Exchange rates for EUR are:\n\n';
    // this.exchangeRates.currencies.forEach((key) => {
    requiredCurrencies.forEach((key) => {
      text += `💸  ${key}: ${classicRates[key]}\n`;
    });
    text += `\nBitcoin's current value: ${bitcoinRate.eur}€  💸`;
    return text;
  }

  // eslint-disable-next-line class-methods-use-this
  reset(): void { }
}
export default DailyFinancialStatus;
