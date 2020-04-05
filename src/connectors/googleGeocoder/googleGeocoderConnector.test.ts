import GoogleGeocoderConnector from './googleGeocoderConnector';


function getMockConnector() {
  return new GoogleGeocoderConnector();
}


test('get exemplary location from latitude and longitude', async () => {
  const expected = ['Paris', 'France', 'FR'];
  const mockConnector = getMockConnector();
  const actual = await mockConnector.getLocationName(48.8698679, 2.3072976);
  expect(actual).toEqual(expected);
});