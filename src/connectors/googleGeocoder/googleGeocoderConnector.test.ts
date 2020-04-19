import GoogleGeocoderConnector from './googleGeocoderConnector';
const NodeGeocoder = require('node-geocoder');

process.env.GOOGLE_KEY = null;

const geocoderOptions = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: process.env.GOOGLE_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
}


const mockResponse = [
  {
    formattedAddress: 'Stuttgarter Str. 30, 71069 Sindelfingen, Germany',
    latitude: 48.7261368,
    longitude: 8.9682243,
    extra: {
      googlePlaceId: 'ChIJN09SIoTfmUcRwdnLOobckMc',
      confidence: 1,
      premise: null,
      subpremise: null,
      neighborhood: 'Maichingen',
      establishment: null
    },
    administrativeLevels: {
      level3long: 'Böblingen',
      level3short: 'BB',
      level2long: 'Stuttgart',
      level2short: 'Süd',
      level1long: 'Baden-Württemberg',
      level1short: 'BW'
    },
    streetNumber: '30',
    streetName: 'Stuttgarter Straße',
    city: 'Sindelfingen',
    country: 'Germany',
    countryCode: 'DE',
    zipcode: '71069',
    provider: 'google'
  }
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
  const actual = new GoogleGeocoderConnector().formatResponse(mockResponse);
  expect(actual).toEqual(expected);
})




