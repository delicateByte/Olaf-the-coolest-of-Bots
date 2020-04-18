import NewsFlashUsecase from './newsFlashUseCase';
import TextResponse from '../../classes/TextResponse';
import VoiceResponse from '../../classes/VoiceResponse';
import EndUseCaseResponse from '../../classes/EndUseCaseResponse';
import TelegramMessageType from '../../classes/TelegramMessageType';
import Preferences from '../../core/preferences';


const mockNewsReturn = {
  articles: [{
    title: 'Some Title',
    description: 'Some description…',
  }, {
    title: 'Some Title',
    description: 'Some description…',
  },

  ],
};
const newsTextResponse = '🌐 The News from a News Company 🌐 \n'
    + '\n'
    + ' 🔹Some Title\n'
    + 'Some description…\n'
    + '\n'
    + ' 🔹Some Title\n'
    + 'Some description…\n'
    + '\n';
const getHeadlines = jest.fn();
jest.mock('../../connectors/news/newsApiConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    getHeadlines,
  })),
}));

const mockWeatherResponse = {
  position: { lon: 7.96, lat: 49.81 },
  tempretures_from: 9,
  tempreatures_up_to: 16.67,
  weatherDescription: { mostly: 'Clear', description: 'clear sky' },
};
const weatherTextResponseFail = '🌧 Your Local Weather -  ☀ '
+ '\n\nAn Error has OccurredSome Error Reason';
const getCurrentWeather = jest.fn();
const weatherTextResponse = '🌧 Your Local Weather -  ☀ \n'
    + '\n'
    + ' Today: clear sky with Temperatures from 9 to 16.67°C \n'
    + ' Still stay Inside!';
const resetWeatherLocation = jest.fn();
jest.mock('../../connectors/openWeatherConnector/openWeatherConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    getCurrentWeather,
    resetLocation: resetWeatherLocation,
  })),
}));

const mockCoronaReturn = {
  total_Cases_Ger: '137,698',
  new_Cases: '2,945',
  new_cases: '2,945',
  total_deaths: '4,052',
  new_deaths: '248',
  record_date: '2020-04-16 22:40:02.617',
};
const coronaTextResponse = '☣ Update on the Pandemic - [GER] ☣\n\n'
+ 'Information from:2020-04-16 22:40:02.617'
+ '\n Total Cases :137,698\n\n'
+ 'Lives Lost:4,052\n\n'
+ 'Stay Safe Stay Indoors';
const getCoronaData = jest.fn();
jest.mock('../../connectors/coronaConnector/coronaConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    getCoronaData,
  })),
}));
const mockTwitterReturn = [
  '#GNTM', '#illner', '#BaywatchBerlin',
  '#Lanz', '#Gebauer', 'Trump',
  'jungkook', 'Schulen', 'China',
  'Europe', 'ende august', 'America',

];
const twitterTextResponse = '🐦 Twitter Trends -  📰 \n'
    + '\n'
    + ' What actually keeps the World spinning? Find out with these Twitter trends-\n'
    + '1.#GNTM\n'
    + '2.#illner\n'
    + '3.#BaywatchBerlin\n'
    + '4.#Lanz\n'
    + '5.#Gebauer\n'
    + '6.Trump\n'
    + '7.jungkook\n'
    + '8.Schulen\n'
    + '9.China\n'
    + '10.Europe\n'
    + 'Still stay Inside!';

const getTwitterTrends = jest.fn();
jest.mock('../../connectors/twitterConnector/twitterConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    getTwitterTrends,
  })),
}));

jest.mock('../../core/preferences');

beforeEach(() => {
  jest.resetModules();
  getHeadlines.mockReset();
  getCurrentWeather.mockReset();
  getTwitterTrends.mockReset();
  getCoronaData.mockReset();
});
describe('UseCase interface', () => {
  test('if reseting Usecase is working', () => {
    const testInstance = new NewsFlashUsecase();
    testInstance.state = 2;
    testInstance.reset();
    return expect(testInstance.state).toEqual(0);
  });
  test('if initial Response is prepared', () => {
    const testInstance = new NewsFlashUsecase();

    return expect(testInstance.prepareInitialResponse()).resolves.toStrictEqual(new VoiceResponse('You want the News, you can get them.We just need your location to give you the correct Information.'));
  });

  test('receiving a message works - proactive', async () => {
    const responses = await new NewsFlashUsecase().receiveMessage({
      originalMessage: undefined,
      type: TelegramMessageType.TEXT,
    });
    // @ts-ignore
    Preferences.get.mockReturnValueOnce('Trumpf,Biden');
    getHeadlines.mockResolvedValue(mockNewsReturn);
    getTwitterTrends.mockResolvedValue(mockTwitterReturn);
    getCurrentWeather.mockResolvedValue(mockWeatherResponse);
    getCoronaData.mockResolvedValue(mockCoronaReturn);

    expect((await responses.next()).value).toEqual(new TextResponse(newsTextResponse));
    expect((await responses.next()).value).toEqual(new TextResponse(coronaTextResponse));
    expect((await responses.next()).value).toEqual(new TextResponse(weatherTextResponse));
    expect((await responses.next()).value).toEqual(new TextResponse(twitterTextResponse));
    expect((await responses.next()).value).toEqual(new EndUseCaseResponse());
  });
  test('receiving a message works ', async () => {
    const testInstance = await new NewsFlashUsecase();
    const initialresponse = testInstance.receiveMessage({
      originalMessage: { message_id: 1, date: 123, chat: { id: 123, type: 'private' } },
      text: 'Flash Me',
      type: TelegramMessageType.TEXT,
    });
    expect((await initialresponse.next()).value).toEqual(new VoiceResponse('You want the News, you can get them.We just need your location to give you the correct Information.'));
    const responses = await testInstance.receiveMessage({
      originalMessage: { message_id: 1, date: 123, chat: { id: 123, type: 'private' } },
      latitude: 3,
      longitude: 4,
      type: TelegramMessageType.LOCATION,
    });
    getHeadlines.mockResolvedValue(mockNewsReturn);
    getTwitterTrends.mockResolvedValue(mockTwitterReturn);
    getCurrentWeather.mockResolvedValue(mockWeatherResponse);
    getCoronaData.mockResolvedValue(mockCoronaReturn);

    expect((await responses.next()).value).toEqual(new TextResponse(newsTextResponse));
    expect((await responses.next()).value).toEqual(new TextResponse(coronaTextResponse));
    expect((await responses.next()).value).toEqual(new TextResponse(weatherTextResponse));
    expect((await responses.next()).value).toEqual(new TextResponse(twitterTextResponse));
    expect((await responses.next()).value).toEqual(new EndUseCaseResponse());
  });
});

describe('formating of Responses', () => {
  test('News', async () => {
    const testInstance = new NewsFlashUsecase();
    // @ts-ignore
    getHeadlines.mockResolvedValue(mockNewsReturn);
    return expect(testInstance.formatNewsResponse()).resolves.toStrictEqual(
      new TextResponse(newsTextResponse),
    );
  });

  test('Corona', () => {
    const testInstance = new NewsFlashUsecase();
    // @ts-ignore
    getCoronaData.mockResolvedValue(mockCoronaReturn);
    return expect(testInstance.formatCoronaResponse()).resolves.toStrictEqual(
      new TextResponse(coronaTextResponse),
    );
  });

  test('Weather', () => {
    const testInstance = new NewsFlashUsecase();
    // @ts-ignore
    getCurrentWeather.mockResolvedValue(mockWeatherResponse);
    return expect(testInstance.formatWeatherUpdate()).resolves.toStrictEqual(
      new TextResponse(weatherTextResponse),
    );
  });
  test('Weather - Fail', () => {
    const testInstance = new NewsFlashUsecase();
    // @ts-ignore
    getCurrentWeather.mockRejectedValue('Some Error Reason');
    return expect(testInstance.formatWeatherUpdate()).resolves.toStrictEqual(
      new TextResponse(weatherTextResponseFail),
    );
  });
  test('Twitter', () => {
    const testInstance = new NewsFlashUsecase();
    // @ts-ignore
    getTwitterTrends.mockResolvedValue(mockTwitterReturn);
    return expect(testInstance.formatTwitterTrends()).resolves.toStrictEqual(
      new TextResponse(twitterTextResponse),
    );
  });
});
test('if preparing generator yield is working', () => {
  const testInstance = new NewsFlashUsecase();
  getHeadlines.mockResolvedValue(mockNewsReturn);
  getTwitterTrends.mockResolvedValue(mockTwitterReturn);
  getCurrentWeather.mockResolvedValue(mockWeatherResponse);
  getCoronaData.mockResolvedValue(mockCoronaReturn);
  return expect(testInstance.prepareNewsFlash()).resolves.toStrictEqual(
    [
      new TextResponse(newsTextResponse),
      new TextResponse(coronaTextResponse),
      new TextResponse(weatherTextResponse),
      new TextResponse(twitterTextResponse),
      new EndUseCaseResponse(),
    ],
  );
});
