import GoogleTranslatorConnector from './googleTranslatorConnector';


function getMockConnector() {
  return new GoogleTranslatorConnector();
}


test('Translate exemplary German text to English', async () => {
  const expected = 'Hello how are you?';
  const mockConnector = getMockConnector();
  const actual = await mockConnector.translate('Hallo, wie geht es dir?', 'de');
  expect(actual).toEqual(expected);
});


test('Translate text with faulty country code', async () => {
  const mockConnector = getMockConnector();
  const actual = await mockConnector.translate('Test', 'abc');
  expect(actual).toEqual(null);
});