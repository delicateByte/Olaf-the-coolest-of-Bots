import * as dotenv from 'dotenv';
import axios from 'axios';
import { UnsplashConnectorImplementation } from '../unsplash';

dotenv.config();
jest.mock('axios');

// @ts-ignore
axios.create.mockReturnValue({
  get: () => Promise.resolve({ data: { urls: { regular: 'url' } } }),
});
let connector = new UnsplashConnectorImplementation(process.env.UNSPLASH_TOKEN);

test('get random image', async () => {
  const actual = await connector.getRandomImage();
  console.log(actual);
  expect(actual).toBeDefined();
});
