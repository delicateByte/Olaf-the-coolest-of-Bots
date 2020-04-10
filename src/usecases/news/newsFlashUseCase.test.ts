
import VoiceResponse from '../../classes/VoiceResponse';
import NewsFlashUsecase from './newsFlashUseCase';
import TextResponse from '../../classes/TextResponse';

const mockNewsReturn = {
  articles: [{
    title: 'Some Title',
    description: 'Some description…',
  },{
    title: 'Some Title',
    description: 'Some description…',
  },

  ],
};
const mockCoronaResponse={};
const mockWeatherResponse={};
jest.mock('../../connectors/coronaConnector/coronaConnector', () => ({
  __esModule: true,
  default: jest.fn(() => {}),
  getCoronaData:
    jest.fn((a) => (b) => { Promise.resolve(mockCoronaResponse); }),

}));
jest.mock('../../connectors/news/newsApiConnector', () => ({
  __esModule: true,
  default: jest.fn(() => {}),
  getHeadlines:
      jest.fn((a) => (b) => { Promise.resolve(mockNewsReturn); }),

}));
jest.mock('../../connectors/openWeatherConnector/openWeatherConnector', () => ({
  __esModule: true,
  default: jest.fn(() => {}),
  getCurrentWeather:
      jest.fn((a) => (b) => { Promise.resolve(mockWeatherResponse); }),

}));
jest.mock('../../connectors/twitterConnector/twitterConnector', () => ({
  __esModule: true,
  default: jest.fn(() => {}),
  getTwitterTrends:
      jest.fn((a) => (b) => { Promise.resolve(mockWeatherResponse); }),

}));
const NewsApiConnector = require('../../connectors/news/newsApiConnector');
const TwitterConnector = require('../../connectors/twitterConnector/twitterConnector');
const CoronaConnector = require('../../connectors/coronaConnector/coronaConnector');
 const OpwnWeatherConnector = require('../../connectors/openWeatherConnector/openWeatherConnector');
import OpenWeatherConnector from "../../connectors/openWeatherConnector/openWeatherConnector";

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
test('if update Weather position', () => {
  const testInstance = new NewsFlashUsecase();
  testInstance.updateWeatherPosition(3, 4);
  expect(testInstance.weather.position).toEqual(new OpenWeatherConnector(4, 3).position);
});


test('if formatting News response is working', () => {
  // console.log(NewsApiConnector);
  // console.log(NewsApiConnector.getHeadlines([]));
  const testInstance = new NewsFlashUsecase();
  return expect(testInstance.formatNewsResponse()).resolves.toEqual(new TextResponse(''));
});
test('if formatting Corona response is working', () => {
  // console.log(NewsApiConnector);
  // console.log(NewsApiConnector.getHeadlines([]));
  const testInstance = new NewsFlashUsecase();
  return expect(testInstance.formatCoronaResponse()).resolves.toEqual(new TextResponse(''));
});
test('if formatting Weather response is working', () => {
  // console.log(NewsApiConnector);
  // console.log(NewsApiConnector.getHeadlines([]));
  const testInstance = new NewsFlashUsecase();
  return expect(testInstance.formatWeatherUpdate()).resolves.toEqual(new TextResponse(''));
});
test('if formatting twitter response is working', () => {
  // console.log(NewsApiConnector);
  // console.log(NewsApiConnector.getHeadlines([]));
  const testInstance = new NewsFlashUsecase();
  return expect(testInstance.formatTwitterTrends()).resolves.toEqual(new TextResponse(''));
});
test('if preparing generator yield is working', () => {

  const testInstance = new NewsFlashUsecase();
  return expect(testInstance.prepareNewsFlash()).resolves.toBe([]);
});