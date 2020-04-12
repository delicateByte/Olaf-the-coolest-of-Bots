/* eslint-disable import/first */
jest.mock('axios');
import axios from 'axios';

import ChuckNorris from './chucknorris';

test('get Joke', async () => {
  // @ts-ignore
  axios.get.mockResolvedValue({ data: { value: { joke: 'Joke' } } });

  const joke = await ChuckNorris.getJoke();
  expect(joke).toEqual({ joke: 'Joke' });
});

test('get Joke fails', async () => {
  // @ts-ignore
  axios.get.mockResolvedValue({ joke: 'Chuck Norris was not unable to make up a joke, the API failed to deliver one to you.' });

  const joke = await ChuckNorris.getJoke();
  expect(joke).toEqual({ joke: 'Chuck Norris was not unable to make up a joke, the API failed to deliver one to you.' });
});
