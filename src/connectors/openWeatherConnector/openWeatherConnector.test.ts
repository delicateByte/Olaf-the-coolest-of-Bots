import * as Weather from 'openweather-apis';
import OpenWeatherConnector from './openWeatherConnector';


const responseMock = {
  coord: { lon: 8.25, lat: 49.99 },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'Klarer Himmel',
      icon: '01n',
    },
  ],
  base: 'stations',
  main: {
    temp: 4.94,
    feels_like: 2.01,
    temp_min: 1.11,
    temp_max: 9,
    pressure: 1021,
    humidity: 69,
  },
  visibility: 10000,
  wind: { speed: 1.3, deg: 319 },
  clouds: { all: 1 },
  dt: 1585956555,
  sys: {
    type: 1,
    id: 1857,
    country: 'DE',
    sunrise: 1585976182,
    sunset: 1586023382,
  },
  timezone: 7200,
  id: 2874225,
  name: 'Mainz',
  cod: 200,
};
const shouldResolveTo = {
  position: { lon: 8.25, lat: 49.99 },
  tempretures_from: 1.11,
  tempreatures_up_to: 9,
  weatherDescription: { mostly: 'Clear', description: 'Klarer Himmel' },
};
jest.mock('openweather-apis');

function getMockConnector(response) : OpenWeatherConnector {
  // @ts-ignore
  Weather.getAllWeather.mockReturnValue((callback) => callback(null, response));
  return new OpenWeatherConnector(24.9574, 2.12434);
}

test('if weatherConnector is working', async () => {
  const mockCallback = jest.fn((err,x) => x);
  Weather.getAllWeather(mockCallback,responseMock).mockImplementation((callback,response) => callback("string",response));
  await expect(mockCallback.mock.results[0].value).toEqual(shouldResolveTo);

});

test('if formating weather Results is working ', async () => {
  await expect(getMockConnector('irrelevant').extractRelevantInformation(responseMock)).toEqual(shouldResolveTo);
});
test('if reconfiguring location is working ', async () => {
  await expect(getMockConnector('irrelevant').resetLocation(29.9574, 3.12434)).toBeUndefined();
});
