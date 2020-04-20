import axios from 'axios';
import GoogleTranslatorConnector from './googleTranslatorConnector';


jest.mock('axios');


const mockResponse = {
  data: {
    data: {
      translations: [
        {
          translatedText: "Hallo wie geht's dir?",
          detectedSourceLanguage: 'en',
        },
      ],
    },
  },
};

process.env.GOOGLE_KEY = null;


function getMockConnector(response) {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve(response),
  });
  return new GoogleTranslatorConnector();
}

test('translate exemplary english text to german', async () => {
  expect(getMockConnector(mockResponse).translate('Hello, how are you?', 'de'))
    .resolves.toEqual("Hallo wie geht's dir?");
});
