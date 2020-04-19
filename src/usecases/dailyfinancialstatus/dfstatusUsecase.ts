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
  private coinGeckoPath = '/simple/price?ids=bitcoin&vs_currencies=eur';
  private classicRates;
  private bitcoinRate;
  private timeZoneOffsetHours;

  constructor() {
    this.timeZoneOffsetHours = new Date().getTimezoneOffset() / 60; // -2
  }

  async* receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    const allClassicRates = await this.exchangeRates.getCurrentStatus();
    this.classicRates = this.exchangeRates.getCurrencies(allClassicRates);
    this.bitcoinRate = await this.coinGecko.getCurrentStatus(this.coinGeckoPath);

    if (message) {
      yield new TextResponse('Here\'s your financial update: ');
      yield new TextResponse(this.generateTextmessage(
        this.classicRates, this.bitcoinRate, this.exchangeRates.currencies,
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
      console.log('Error loading client secret file:', err);
    }
  }

  async* retrieveEvents(auth) {
    const calendar = gcAuthentication.google.calendar({ version: 'v3', auth });
    const calendarID = Preferences.get('dfstatus', 'dfstatusCalendarID');
    if (calendarID === '') {
      yield new TextResponse('No calender ID specified, cannot check appointments.');
    } else {
      const startD = new Date().getDate();
      const startM = new Date().getMonth();
      const startY = new Date().getFullYear();
      const startH = 0 - this.timeZoneOffsetHours;
      const startMin = 0;

      const answer = await calendar.freebusy.query({
        auth,
        resource: {
          timeMin: (new Date(startY, startM, startD, startH, startMin)).toISOString(),
          timeMax: (new Date(startY, startM, startD, startH + 24, startMin)).toISOString(),
          items: [{ id: calendarID }],
        },
      });
      // busyEvents do not consider time zone - still UTC!
      const busyEvents = answer.data.calendars[calendarID].busy;
      yield* this.checkAppointmentTimes(busyEvents);
    }
  }

  private async* checkAppointmentTimes(busyEvents): AsyncGenerator<UseCaseResponse> {
    if (busyEvents.length > 0) {
      let isFree = true;
      const preferenceTime = Preferences.get('dfstatus', 'dfstatusProactiveTime');
      busyEvents.forEach((event) => {
        const date = new Date();
        const start = new Date(date.getTime());
        start.setHours(event.start.split(':')[0].slice(-2) - 2 * this.timeZoneOffsetHours);
        start.setMinutes(event.start.split(':')[1]);
        const end = new Date(date.getTime());
        end.setHours(event.end.split(':')[0].slice(-2) - 2 * this.timeZoneOffsetHours);
        end.setMinutes(event.end.split(':')[1]);
        const preferenceDate = new Date();
        preferenceDate.setHours(preferenceTime.split(':')[0] - this.timeZoneOffsetHours);
        preferenceDate.setMinutes(preferenceTime.split(':')[1]);
        if (start < preferenceDate && end > preferenceDate) {
          isFree = false; // don't send text message if there is an appointment
        }
      });
      if (isFree) {
        yield new TextResponse(this.generateTextmessage(
          this.classicRates, this.bitcoinRate, this.exchangeRates.currencies,
        ));
      }
    } else {
      yield new TextResponse(this.generateTextmessage(
        this.classicRates, this.bitcoinRate, this.exchangeRates.currencies,
      ));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  generateTextmessage(classicRates, bitcoinRate, requiredCurrencies): string {
    const money = String.fromCodePoint(0x1F4B8);
    let text = '';
    text += 'Exchange rates for EUR are:\n\n';
    // this.exchangeRates.currencies.forEach((key) => {
    requiredCurrencies.forEach((key) => {
      text += `${money}  ${key}: ${classicRates[key]}\n`;
    });
    text += `\nBitcoin's current value: ${bitcoinRate.eur}€  ${money}`;
    return text;
  }

  // eslint-disable-next-line class-methods-use-this
  reset(): void { }
}
export default DailyFinancialStatus;
