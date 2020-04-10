
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
    this.name = 'NewsFlash';
    this.triggers.push('news flash');
    this.triggers.push('news');
    this.triggers.push('flash me');
    this.state = 0;
    this.initiateConnector();
  }

  private initiateConnector() {
    this.weather = new OpenWeatherConnector(48.78232, 9.17702);
    this.news = new NewsApiConnector();
    this.corona = new CoronaConnector();
    this.twitter = new TwitterConnector();
  }

  async prepareInitialResponse() :Promise<VoiceResponse> {
    this.state = 2;
    return new VoiceResponse('You want the News, you can get them.We just need your location to give you the correct Information.');
  }

  async formatNewsResponse() {
    let text = '🌐 The News from a News Company 🌐 \n\n';
    await console.log(typeof this.news.getHeadlines([]));
    const headlines = await this.news.getHeadlines([]);// Preferences.get('news', 'Newskeywords').split(','));
    headlines.articles.forEach((story, index) => {
      if (index < 9) {
        text = `${text} 🔹${story.title}\n${story.description}\n\n`;
      }
    });
    return new TextResponse(text);
  }

  async formatCoronaResponse() {
    let text = '☣ Update on the Pandemic - [GER] ☣ \n\n';
    const coronaInfo = await this.corona.getCoronaData();
    text = `${text}Information from:${coronaInfo.record_date}\n Total Cases :${coronaInfo.total_Cases_Ger}\n\n`
        + `Lives Lost:${coronaInfo.total_deaths}\n\n`
    + 'Stay Safe Stay Indoors';
    return new TextResponse(text);
  }

  async formatWeatherUpdate() {
    let text = '🌧 Your Local Weather -  ☀ \n\n';
    text += await this.weather.getCurrentWeather().then((weatherInfo) => ` Today: ${weatherInfo.weatherDescription.description} with Temperatures from ${weatherInfo.tempretures_from} to ${weatherInfo.tempreatures_up_to}°C`
          + ' \n Still stay Inside!').catch((err) => `An Error has Occurred${err}`);

    return new TextResponse(text);
  }

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
    }).catch((err) => `An Error has Occurred\n ${err}`);
    return new TextResponse(text);
  }

  async prepareNewsFlash() :Promise<UseCaseResponse[]> {
    const results = [];
    results.push(await this.formatNewsResponse());
    results.push(await this.formatCoronaResponse());
    results.push(await this.formatWeatherUpdate());
    results.push(await this.formatTwitterTrends());
    results.push(new EndUseCaseResponse());
    return results;
  }

  updateWeatherPosition(lon:number, lat :number) {
    console.log('updating weather');

    this.weather.resetLocation(lat, lon);
  }

  async* receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    if (message === null || message === undefined) {
      console.log('Cron Job Trigger');
      const messages = await this.prepareNewsFlash();
      for (let i = 0; i < messages.length; i++) {
        yield messages[i];
      }
    } else if (this.state === 0) {
      yield await this.prepareInitialResponse().then((response) => {
        this.state = 1;
        return response;
      }).catch((err) => {
        console.log(err);
        this.reset();
        return new TextResponse('An Error has occured. The Use case is restarting, please try again');
      });
    } else if (this.state === 1) {
      this.state = 2;
      if (message.type === TelegramMessageType.LOCATION) {
        await this.updateWeatherPosition(message.longitude, message.latitude);
        const messages = await this.prepareNewsFlash();
        for (let i = 0; i < messages.length; i++) {
          yield messages[i];
        }
        this.state = 0;
      } else {
        this.state = 1;
      }
    }
  }

  reset(): void {
    this.state = 0;
    this.initiateConnector();
  }
}

export default NewsFlashUsecase;
