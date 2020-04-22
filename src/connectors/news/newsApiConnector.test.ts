import axios from 'axios';
import NewsApiConnector from './newsApiConnector';

jest.mock('axios');
const resultMock = {


  status: 'ok',
  totalResults: 1,
  articles: [
    {
      source: {
        id: null,
        name: 'Chip.de',
      },
      author: 'Konstantinos Mitsis',
      title: 'Aldi, Lidl, Rewe & Co. verschärfen Regeln: Filialen verändern sich wegen Corona massiv - CHIP Online Deutschland',
      description: 'Die Verunsicherung durch das Coronavirus verändert auch die Art, wie wir einkaufen. Viele Supermärkte und Discounter wie Aldi, Lidl oder Rewe ändern ihr Sortiment und ihre Abläufe. CHIP fasst die wichtigsten Veränderungen zusammen. Worauf Sie beim Einkaufen i…',
    },

  ],


};
const rejectMock = { articles: [{ title: 'ERROR IN TRANSMISSION' }] };
function getMockConnector(response) : NewsApiConnector {
  // @ts-ignore
  axios.create.mockReturnValueOnce({ get: () => Promise.resolve({ data: response }) });
  return new NewsApiConnector();
}
function getMockConnectorButTriggerAxiosError(rejectResponse) : NewsApiConnector {
  // @ts-ignore
  axios.create.mockReturnValueOnce({ get: () => Promise.reject(rejectResponse) });
  return new NewsApiConnector();
}


test('Test News without Keywords', async () => expect(getMockConnector(resultMock).getHeadlines([])).resolves.toEqual(resultMock));
test('Test News With Keywords', async () => expect(getMockConnector(resultMock).getHeadlines(['please', 'for', 'the', 'love', 'of', 'god', 'WORK!!!!'])).resolves.toEqual(resultMock));
test('Test News without Keywords-> Should Fail', async () => expect(getMockConnectorButTriggerAxiosError('Some Reason Axios Fails').getHeadlines([])).resolves.toEqual(rejectMock));
test('Test News With Keywords -> Should FAIL', async () => expect(getMockConnectorButTriggerAxiosError('Some Reason Axios Fails').getHeadlines(['please', 'for', 'the', 'love', 'of', 'god', 'WORK!!!!'])).resolves.toEqual(rejectMock));
