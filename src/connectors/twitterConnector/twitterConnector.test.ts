import * as Twitter from 'twitter';
import TwitterConnector from './twitterConnector';

const mockResult = [
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
        name: '#FelizMiercoles',
        url: 'http://twitter.com/search?q=%23FelizMiercoles',
        promoted_content: null,
        query: '%23FelizMiercoles',
        tweet_volume: 36103,
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
const formattedArrayResolution = ['#ChainedToTheRhythm', '#FelizMiercoles'];
jest.mock('Twitter');
function getMockConnector() {
  // @ts-ignore
  const path = 'trends/place';
  const params = {};
  return new TwitterConnector();
}
test('if getting Trends is Working', async () => {
  const testInstance = new TwitterConnector();
  console.log(Twitter);

  Twitter.get.mockResolvedValue(mockResult);
  return expect(testInstance.getTwitterTrends()).resolves.toEqual(formattedArrayResolution);
});

test('if reformatting of Trends is working', async () => {
  const testInstance = new TwitterConnector();
  return expect(testInstance.formatTwitterTrendResults(mockResult)).resolves.toEqual(formattedArrayResolution);
});
