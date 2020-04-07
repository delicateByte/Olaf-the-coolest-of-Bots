import axios from 'axios';

import TwitterConnector from './twitterConnector';


jest.mock('axios');
const mockTrendArray = [
  '#ChainedToTheRhythm', '#اليوم_العالمي_للعتبان', 'George Lopez',
];
const mockTrendsResponse = [
  {
    trends: [
      {
        name: '#ChainedToTheRhythm',
        url: 'http://twitter.com/search?q=%23ChainedToTheRhythm',
        promoted_content: null,
        query: '%23ChainedToTheRhythm',
        tweet_volume: 48857,
      },
      {
        name: '#اليوم_العالمي_للعتبان',
        url: 'http://twitter.com/search?q=%23%D8%A7%D9%84%D9%8A%D9%88%D9%85_%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85%D9%8A_%D9%84%D9%84%D8%B9%D8%AA%D8%A8%D8%A7%D9%86',
        promoted_content: null,
        query: '%23%D8%A7%D9%84%D9%8A%D9%88%D9%85_%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85%D9%8A_%D9%84%D9%84%D8%B9%D8%AA%D8%A8%D8%A7%D9%86',
        tweet_volume: null,
      },
      {
        name: 'George Lopez',
        url: 'http://twitter.com/search?q=%22George+Lopez%22',
        promoted_content: null,
        query: '%22George+Lopez%22',
        tweet_volume: 90590,
      },
    ],
    as_of: '2017-02-08T16:18:18Z',
    created_at: '2017-02-08T16:10:33Z',
    locations: [
      {
        name: 'Worldwide',
        woeid: 1,
      },
    ],
  },
];
function getMockConnector(response) : TwitterConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: response }),
  });
  return new TwitterConnector();
}

test('if retrieving  Twitter Trends is working', async () => {
  expect(getMockConnector(mockTrendsResponse).getTwitterTrends()).resolves.toEqual(mockTrendArray);
});

test('if formatting Twitter Trends is working', async () => {
  const testInstance = new TwitterConnector();
  expect(testInstance.formatTwitterTrendResults(mockTrendsResponse)).resolves.toEqual(mockTrendArray);
});
