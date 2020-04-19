import GoogleTranslatorConnector from './googleTranslatorConnector';
import axios from 'axios';


jest.mock('axios');


const mockResponse = {
  status: 200,
  statusText: 'OK',
  headers: {
    'content-type': 'application/json; charset=UTF-8',
    vary: 'X-Origin, Referer, Origin,Accept-Encoding',
    date: 'Sun, 19 Apr 2020 11:39:58 GMT',
    server: 'ESF',
    'cache-control': 'private',
    'x-xss-protection': '0',
    'x-frame-options': 'SAMEORIGIN',
    'x-content-type-options': 'nosniff',
    'alt-svc': 'quic=":443"; ma=2592000; v="46,43",h3-Q050=":443"; ma=2592000,h3-Q049=":443"; ma=2592000,h3-Q048=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,h3-T050=":443"; ma=2592000',
    'accept-ranges': 'none',
    connection: 'close',
    'transfer-encoding': 'chunked'
  },
  data: { 
    data: { 
      translations: [
        {
          translatedText: "Hallo wie geht's dir?",
          detectedSourceLanguage: 'en'
        }
      ] 
    } 
  }
}

process.env.GOOGLE_KEY = null;


function getMockConnector(response) {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve(response),
  });
  return new GoogleTranslatorConnector();
}

test('translate exemplary english text to german', async() => {
  expect(getMockConnector(mockResponse).translate("Hello, how are you?", "de"))
        .resolves.toEqual("Hallo wie geht's dir?");
})