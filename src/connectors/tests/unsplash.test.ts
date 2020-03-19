import axios from 'axios';
import { UnsplashConnector, UnsplashConnectorImplementation } from '../unsplash';

jest.mock('axios');

function getMockConnector(returnValue) : UnsplashConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve(returnValue),
  });
  return new UnsplashConnectorImplementation('');
}

test('get random image', async () => {
  const expected = 'http://example.com/image.jpg';
  const actual = await getMockConnector({ data: { urls: { regular: expected } } }).getRandomImage();
  expect(actual).toBe(expected);
});
