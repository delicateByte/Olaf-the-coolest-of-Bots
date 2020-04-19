import axios from 'axios';
import GoogleKnowledgeBaseConnector from './googleKnowledgeBaseConnector';

jest.mock('axios');


const mockResponse = {
  status: 200,
  statusText: 'OK',
  headers: {},
  itemListElement: [
    {
      resultScore: 14028.6689453125,
      '@type': 'EntitySearchResult',
      result: {
        name: 'Paris',
        '@type': [Array],
        description: 'Capital of France',
        detailedDescription: {
          license: 'https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License',
          url: 'https://en.wikipedia.org/wiki/Paris',
          articleBody: 'Paris is the capital and most populous city of France, with a population of 2,148,271 residents in an area of 105 square kilometres. '
        },
        url: 'http://www.paris.fr',
        '@id': 'kg:/m/05qtj',
        image: [Object]
      }
    }
  ]
}

process.env.GOOGLE_KEY = null;


function getMockConnector(response) {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: response }),
  });
  return new GoogleKnowledgeBaseConnector();
}


test('Get location info from exemplary city name', async () => {
  expect(getMockConnector(mockResponse).getLocationDescription('Paris')).resolves.toEqual(
    'Paris is the capital and most populous city of France, with a population of'
    + ' 2,148,271 residents in an area of 105 square kilometres. '
  );
});