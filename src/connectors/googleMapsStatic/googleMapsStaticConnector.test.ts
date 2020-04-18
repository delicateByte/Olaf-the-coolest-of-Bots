import axios from 'axios';
import * as fs from 'fs';
import { ReadableStreamBuffer } from 'stream-buffers';

import GoogleMapsStaticConnector from './googleMapsStaticConnector';


jest.mock('axios');

function getMockConnector(response) : GoogleMapsStaticConnector {
  // @ts-ignore
  axios.create.mockReturnValue({
    get: () => Promise.resolve({ data: response }),
  });
  return new GoogleMapsStaticConnector('');
}

test('get map image using coordinates', async () => {
  // PNG magic number
  const expected = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const stream = new ReadableStreamBuffer();
  stream.push(expected);
  stream.stop();

  const path = await getMockConnector(stream).getMapImage([42.123, 12.45]);

  const actual = fs.readFileSync(path);
  fs.unlinkSync(path);
  expect(actual).toEqual(expected);
});

test('get map image using location name', async () => {
  // PNG magic number
  const expected = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const stream = new ReadableStreamBuffer();
  stream.push(expected);
  stream.stop();

  const path = await getMockConnector(stream).getMapImage('Stuttgart');

  const actual = fs.readFileSync(path);
  fs.unlinkSync(path);
  expect(actual).toEqual(expected);
});
