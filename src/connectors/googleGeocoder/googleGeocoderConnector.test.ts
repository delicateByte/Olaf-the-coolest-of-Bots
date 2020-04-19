import GoogleGeocoderConnector from './googleGeocoderConnector';

const NodeGeocoder = require('node-geocoder');

process.env.GOOGLE_KEY = null;

const geocoderOptions = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: process.env.GOOGLE_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};


const mockResponse = [
  {
    city: 'Sindelfingen',
    country: 'Germany',
    countryCode: 'DE',
  },
];

test('Get geocoder options', () => {
  const actual = new GoogleGeocoderConnector().getGeocoderOptions();
  expect(actual).toEqual(geocoderOptions);
});

test('Check if initializing the geocoder works', () => {
  const expected = NodeGeocoder(geocoderOptions);
  const actual = new GoogleGeocoderConnector().geocoder;
  expect(actual).toEqual(expected);
});

test('Check if response formatting works', () => {
  const expected = ['Sindelfingen', 'Germany', 'DE'];
  const actual = GoogleGeocoderConnector.formatResponse(mockResponse);
  expect(actual).toEqual(expected);
});
