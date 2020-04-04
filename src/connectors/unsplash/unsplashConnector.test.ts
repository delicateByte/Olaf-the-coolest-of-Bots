import axios from 'axios';
import * as fs from 'fs';
import { ReadableStreamBuffer } from 'stream-buffers';

import UnsplashConnector from './unsplashConnector';
import UnsplashImage from './unsplashImage';


jest.mock('axios');

function getMockConnector(response) : UnsplashConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: response }),
  });
  return new UnsplashConnector('');
}

test('get random image with coordinates and description', async () => {
  const expected = new UnsplashImage(
    'Some description',
    'https://unsplash.com/photos/abc',
    'https://images.unsplash.com/photo-abc',
    'John Doe',
    ['first tag', 'second tag'],
    'Some location',
    [42.123, 12.45],
  );
  const actual = await getMockConnector({
    id: 'abc',
    description: expected.description,
    links: { html: expected.postUrl },
    urls: { raw: expected.imageUrl },
    user: { name: expected.userName },
    tags: expected.tags.map((tag) => ({ title: tag })),
    location: {
      title: expected.location,
      position: { latitude: expected.coordinates[0], longitude: expected.coordinates[1] },
    },
  }).getRandomImage();

  expect(actual).toEqual(expected);
});

test('get random image without coordinates and description', async () => {
  const expected = new UnsplashImage(
    'Some description',
    'https://unsplash.com/photos/abc',
    'https://images.unsplash.com/photo-abc',
    'John Doe',
    ['first tag', 'second tag'],
    'Some location',
    null,
  );
  const actual = await getMockConnector({
    id: 'abc',
    description: null,
    alt_description: expected.description,
    links: { html: expected.postUrl },
    urls: { raw: expected.imageUrl },
    user: { name: expected.userName },
    tags: expected.tags.map((tag) => ({ title: tag })),
    location: {
      title: expected.location,
      position: { latitude: null, longitude: null },
    },
  }).getRandomImage();

  expect(actual).toEqual(expected);
});

test('download image', async () => {
  // PNG magic number
  const expected = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const stream = new ReadableStreamBuffer();
  stream.push(expected);
  stream.stop();

  const path = await getMockConnector(stream)
    // @ts-ignore
    .downloadImage({ imageUrl: 'https://images.unsplash.com/photo-abc' });

  const actual = fs.readFileSync(path);
  fs.unlinkSync(path);
  expect(actual).toEqual(expected);
});
