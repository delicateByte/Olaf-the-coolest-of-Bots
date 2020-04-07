import UseCase from '../../interfaces/useCase';
import TextResponse from '../../classes/TextResponse';
import VoiceResponse from '../../classes/VoiceResponse';
// import weather
// import news
// import corona
// import Twitter
import Preferences from '../../core/preferences';
import ProcessedTelegramMessage from '../../classes/ProcessedTelegramMessage';

class NewsFlashUsecase implements UseCase {
  readonly name: string;
  readonly triggers: string[];
  state:number;
  weather;
  corona;
  news;
  twitter;
  constructor() {
    this.name = 'NewsFlash';
    this.triggers.push('news flash');
    this.triggers.push('news');
    this.triggers.push('flash me');
    this.state = 0;
    this.initiateConnector();
  }

  private initiateConnector() {
    this.weather = {};
    this.news = new {}();
    this.corona = {};
    this.twitter = {};
  }

  private prepareInitialResponse() :Promise {
        
  }

  receiveMessage(message: ProcessedTelegramMessage): AsyncGenerator<UseCaseResponse> {
    if (this.state == 1) {
      this.prepareInitialResponse().then((response) => {
        console.log(response);
        return response;
      }).catch((err) => {
        console.log(err);
        throw err;
      });
      return undefined;
    }


    return undefined;
  }

  reset(): void {
    this.state = 0;
    this.initiateConnector();
  }
}

export default NewsFlashUsecase;
