import GoogleTranslatorConnector from './googleTranslatorConnector';


function getMockConnector() {
  return new GoogleTranslatorConnector();
}


test('Translate exemplary English text to German', async () => {
  const expected = "Hallo wie geht's dir?";
  const mockConnector = getMockConnector();
  const actual = await mockConnector.translate('Hello, how are you?', 'de');
  expect(actual).toEqual(expected);
});


test('Translate text with faulty country code', async () => {
  const mockConnector = getMockConnector();
  const actual = await mockConnector.translate('Test', 'abc');
  expect(actual).toEqual(null);
});