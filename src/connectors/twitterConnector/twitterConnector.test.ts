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
      },
      {
        name: '#اليوم_العالمي_للعتبان',
      },
      {
        name: 'George Lopez',
      },
    ],
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
  expect(
    TwitterConnector.formatTwitterTrendResults(mockTrendsResponse),
  ).resolves.toEqual(mockTrendArray);
});
