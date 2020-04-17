/* eslint-disable consistent-return */
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

  // constructor() {
  // }

  async* receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    const allClassicRates = await this.exchangeRates.getCurrentStatus();
    const classicRates = await this.exchangeRates.getCurrencies(allClassicRates);
    const bitcoinRate = await this.coinGecko.getCurrentStatus();

    if (message) {
      yield new TextResponse('Here\'s your financial update: ');
      yield new TextResponse(this.generateTextmessage(classicRates, bitcoinRate));
      // this.checkForEvents();
    } else if (Preferences.get('dfstatus', 'dfstatusCalendarID') === '') { // proactive case
      yield new TextResponse('No calendar ID specified in dashboard. Cannot check your calendar.');
    } else {
      this.checkForEvents();
    }

    yield new EndUseCaseResponse();
  }

  // eslint-disable-next-line class-methods-use-this
  public async* checkForEvents() {
    try {
      const content = await fs.readFile(path.resolve(__dirname, '../../../credentials.json'));
      // Authorize a client with credentials, then call the Google Calendar API.
      const auth = await new Promise(((resolve) => {
        gcAuthentication.authorize(JSON.parse(content), (res) => resolve(res));
      }));
      yield* this.listEvents(auth);
    } catch (err) {
      console.log('Error loading client secret file:', err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async* listEvents(auth) {
    const calendar = gcAuthentication.google.calendar({ version: 'v3', auth });
    const calendarID = Preferences.get('dfstatus', 'dfstatusCalendarID');

    const startD = new Date().getDate();
    const startM = new Date().getMonth();
    const startY = new Date().getFullYear();
    const startH = 0;
    const startMin = 0;
    console.log(startD, startM, startY);

    const answer = await calendar.freebusy.query({
      auth,
      resource: {
        timeMin: (new Date(startY, startM, startD, startH, startMin)).toISOString(),
        timeMax: (new Date(startY, startM, startD, startH + 28, startMin)).toISOString(),
        items: [{ id: calendarID }],
      },
    });
    const busyEvents = answer.data.calendars[calendarID].busy;
    // busy object is empty if there are no appointments or only all-day events
    console.log(answer.data);
    console.log(busyEvents);

    const preferenceTime = Preferences.get('dfstatus', 'dfstatusProactiveTime');
    console.log(preferenceTime);
    yield* this.proactiveMessageGenerator(preferenceTime);
    //
    // if array is not empty: iterate over elements
    // check if one of its times equals preference time
    // if so, check for the events end time
    // abort use case and don't send message if there is a collision to an appointment
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
  private async* proactiveMessageGenerator(preferenceTime): AsyncGenerator<UseCaseResponse> {
    // eslint-disable-next-line no-new
    yield new TextResponse('Some Text...');
  }

  // eslint-disable-next-line class-methods-use-this
  reset(): void { }
}
export default DailyFinancialStatus;
