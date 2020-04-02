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
      url: 'https://www.chip.de/news/Aldi-Lidl-Rewe-Co.-verschaerfen-Regeln-Filialen-veraendern-sich-wegen-Corona-massiv_182554531.html',
      urlToImage: 'https://www.chip.de/ii/1/2/6/2/3/4/3/0/6/nettoabstand3-f0a024d448c3a2ff.jpg',
      publishedAt: '2020-04-02T17:48:07Z',
      content: 'Digital und kontaktlos bezahlenIn der Coronakrise bekommen Techniken Aufwind, die es eigentlich schon lange gibt. So nutzen die Deutschen nun verstärkt kontaktlose Bezahlmöglichkeiten mit Karte oder Smartphone. Unser Guide beantwortet auf 29 Seiten alle wicht… [+74 chars]',
    },

  ],


};
const rejectMock = { articles: [{ title: 'ERROR IN TRANSMISSION' }] };
function getMockConnector(response) : NewsApiConnector {
  // @ts-ignore
  axios.create.mockReturnValueOnce({get:() => Promise.resolve({ data: response })});
  return new NewsApiConnector();
}
function getMockConnectorButTriggerAxiosError(rejectResponse) : NewsApiConnector {
  // @ts-ignore
  axios.create.mockReturnValueOnce({ get: () => Promise.reject(rejectResponse) });
  return new NewsApiConnector();
}


test('Test News withou Keywords', async () => await expect(getMockConnector(resultMock).getHeadlines([])).resolves.toEqual(resultMock));
test('Test News With Keywords', async () => await expect(getMockConnector(resultMock).getHeadlines(['please', 'for', 'the', 'love', 'of', 'god', 'WORK!!!!'])).resolves.toEqual(resultMock));
test('Test News without Keywords-> Should Fail', async () => await expect(getMockConnectorButTriggerAxiosError('Some Reason Axios Fails').getHeadlines([])).rejects.toEqual(rejectMock));
test('Test News With Keywords -> Should FAIL', async () => await expect(getMockConnectorButTriggerAxiosError('Some Reason Axios Fails').getHeadlines(['please', 'for', 'the', 'love', 'of', 'god', 'WORK!!!!'])).rejects.toEqual(rejectMock));
