import axios from 'axios';
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


jest.mock('axios');

function getMockConnector(response) : OpenWeatherConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: response }),
  });
  return new OpenWeatherConnector(3,4);
}

test('reseting Coordinates is working', async () => {
  const testInstance = new OpenWeatherConnector(29, 4);
  testInstance.resetLocation(12, 11);
  expect(testInstance.position.lat).toEqual(12);
  expect(testInstance.position.long).toEqual(11);
});
test('if reformatting of WeatherResponse is working', async () => {
  const testInstance = new OpenWeatherConnector(29, 4);
  expect(testInstance.extractRelevantInformation(responseMock)).toEqual(shouldResolveTo);
});
test('if getting Weather from API is working', async () => {
  expect(getMockConnector(responseMock).getCurrentWeather()).resolves.toEqual(shouldResolveTo);
});
