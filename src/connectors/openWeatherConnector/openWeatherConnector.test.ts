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
  tempreatures_up_to: 8.89,
  weatherDescription: { mostly: 'Clear', description: 'Klarer Himmel' },
};

jest.mock('openweather-apis');

function getMockConnector(response) : OpenWeatherConnector {
  // @ts-ignore
  Weather.getAllWeather.mockReturnValue({
    get: (callback) => callback(null, response),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCoordinates: (lattitude, longitude) =>  Promise.resolve(null),
  });
  return new OpenWeatherConnector(24.9574, 2.12434);
}

test('if weatherConnector is working', async () => {
  expect(getMockConnector(responseMock).getCurrentWeather()).resolves.toEqual(shouldResolveTo);
});

test('if formating weather Results is working ', async () => {
  expect(getMockConnector('irrelevant').extractRelevantInformation(responseMock)).toEqual(shouldResolveTo);
});
test('if reconfiguring location is working ', async () => {
  expect(getMockConnector('irrelevant').resetLocation(29.9574, 3.12434)).resolves
});
