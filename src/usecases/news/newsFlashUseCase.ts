
import UseCase from '../../interfaces/useCase';
import TextResponse from '../../classes/TextResponse';
import VoiceResponse from '../../classes/VoiceResponse';
import OpenWeatherConnector from '../../connectors/openWeatherConnector/openWeatherConnector';
import NewsApiConnector from '../../connectors/news/newsApiConnector';
import CoronaConnector from '../../connectors/coronaConnector/coronaConnector';
import TwitterConnector from '../../connectors/twitterConnector/twitterConnector';
import Preferences from '../../core/preferences';
import ProcessedTelegramMessage from '../../classes/ProcessedTelegramMessage';
import UseCaseResponse from '../../classes/UseCaseResponse';
import TelegramMessageType from '../../classes/TelegramMessageType';
import EndUseCaseResponse from '../../classes/EndUseCaseResponse';


class NewsFlashUsecase implements UseCase {
  readonly name: string;
  readonly triggers: string[];
  state:number;
  weather:OpenWeatherConnector;
  corona:CoronaConnector;
  news:NewsApiConnector;
  twitter:TwitterConnector;

  constructor() {
    this.triggers = [];
    this.name = 'news';
    this.triggers.push('news flash', 'news', 'flash me');
    this.state = 0;
    this.initiateConnector();
  }

  private initiateConnector() {
    this.weather = new OpenWeatherConnector(48.78232, 9.17702);
    this.news = new NewsApiConnector();
    this.corona = new CoronaConnector();
    this.twitter = new TwitterConnector();
  }

  // erste Antwort (abfrage der Location) setzt den State auf 2
  async prepareInitialResponse() :Promise<VoiceResponse> {
    this.state = 2;
    return new VoiceResponse('You want the News, you can get them.We just need your location to give you the correct Information.');
  }

  // Fragt Aktuelle News ab und gibt die ersten 10 results zurück in einer Telegram Response
  async formatNewsResponse() {
    let text = '🌐 The News from a News Company 🌐 \n\n';
    let preferences = await Preferences.get('news', 'newsKeywords');
    if (preferences === undefined) {
      preferences = [];
    } else {
      preferences = preferences.split(',');
    }
    const headlines = await this.news.getHeadlines(preferences);
    headlines.articles.forEach((story, index) => {
      if (index < 9) {
        text = `${text} 🔹${story.title}\n${story.description}\n\n`;
      }
    });
    return new TextResponse(text);
  }

  // Fragt Corona Informationen ab und formatiert diese für eine Telgram Response
  async formatCoronaResponse() {
    let text = '☣ Update on the Pandemic - [GER] ☣\n\n';
    const coronaInfo = await this.corona.getCoronaData();
    text = `${text}Information from:${coronaInfo.record_date}\n Total Cases :${coronaInfo.total_Cases_Ger}\n\n`
        + `Lives Lost:${coronaInfo.total_deaths}\n\n`
    + 'Stay Safe Stay Indoors';
    return new TextResponse(text);
  }

  // Fragt Wetter ab und formatiert die Antwort für eine Telegram Response
  async formatWeatherUpdate() {
    let text = '🌧 Your Local Weather -  ☀ \n\n';
    text += await this.weather.getCurrentWeather().then((weatherInfo) => ` Today: ${weatherInfo.weatherDescription.description} with Temperatures from ${weatherInfo.tempretures_from} to ${weatherInfo.tempreatures_up_to}°C`
          + ' \n Still stay Inside!').catch((err) => `An Error has Occurred${err}`);
    return new TextResponse(text);
  }

  // Fragt Twitter Trends ab und Formatiert diese für eine Telegram Response
  async formatTwitterTrends() {
    let text = '🐦 Twitter Trends -  📰 \n\n';
    text += await this.twitter.getTwitterTrends().then((twitterTrends) => {
      let textCombination = ' What actually keeps the World spinning? Find out with these Twitter trends-\n';
      twitterTrends.forEach((item, index) => {
        if (index < 10) {
          textCombination += `${index + 1}.${item}\n`;
        }
      });
      textCombination += 'Still stay Inside!';
      return textCombination;
    });
    return new TextResponse(text);
  }

  // Startet die Ausgabe der Informationen vom Usecase
  async* prepareNewsFlash() :AsyncGenerator<UseCaseResponse> {
    yield await this.formatNewsResponse();
    yield await this.formatCoronaResponse();
    yield await this.formatWeatherUpdate();
    yield await this.formatTwitterTrends();
    yield new EndUseCaseResponse();
  }

  updateWeatherPosition(lon:number, lat :number) {
    this.weather.resetLocation(lat, lon);
  }

  /** @function receiveMessage
   * Erhält alle Messages wenn der Usecase Aktiv ist
   * Verwaltet die Staten, in welcher der Usecase
   * Gibt Atworten asynchron zurück
   * @param message (TelegramMessage) Extrahierte Informationen aus der
   *        originalen Telegram nachricht
   * @yields  Telegram Responses
   */
  async* receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    if (message === null || message.originalMessage === undefined) {
      // Branch: Proactive Trigger
      yield* await this.prepareNewsFlash();
    } else if (this.state === 0) {
      // Branch: Triggered with Message
      yield await this.prepareInitialResponse().then((response) => {
        this.state = 1;
        return response;
      });
    } else if (this.state === 1) {
      this.state = 2; // Use case in progress
      if (message.type === TelegramMessageType.LOCATION) {
        // Branch: Recieved Location -> trigger Responses
        await this.updateWeatherPosition(message.longitude, message.latitude);
        yield* await this.prepareNewsFlash();
        this.state = 0; // Reset Use case
      } else {
        this.state = 1; // waiting for Location state
      }
    }
  }

  reset(): void {
    this.state = 0;
    this.initiateConnector();
  }
}

export default NewsFlashUsecase;
