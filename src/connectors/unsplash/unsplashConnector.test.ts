import axios from 'axios';
import UnsplashConnector from './unsplashConnector';
import UnsplashImage from './unsplashImage';

jest.mock('axios');

function getMockConnector(returnValue) : UnsplashConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve(returnValue),
  });
  return new UnsplashConnector('');
}

test('get random image', async () => {
  const expected = new UnsplashImage(
    'Some description',
    'https://unsplash.com/photos/abc',
    'https://images.unsplash.com/photo-abc',
    'John Doe',
    ['first tag', 'second tag'],
    [42.123, 12.45],
  );
  const actual = await getMockConnector({
    data: {
      id: 'abc',
      description: expected.description,
      links: { html: expected.postUrl },
      urls: { full: expected.imageUrl },
      user: { name: expected.userName },
      tags: expected.tags.map((tag) => ({ title: tag })),
      location: { position: { latitude: expected.location[0], longitude: expected.location[1] } },
    },
  }).getRandomImage();

  expect(actual).toEqual(expected);
});
