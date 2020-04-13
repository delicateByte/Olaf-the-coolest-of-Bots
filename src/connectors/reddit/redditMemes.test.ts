/* eslint-disable import/order, import/first */
import RedditMemes from './redditMemes';

jest.mock('axios');
import axios from 'axios';

jest.mock('../../core/preferences');
import Preferences from '../../core/preferences';

test('get Meme', async () => {
  const axiosData = {
    data: {
      data: {
        children: [{
          data: {
            stickied: false,
            post_hint: 'image',
            id: 'id',
            url: 'URL',
            title: 'Title',
          },
        }],
      },
    },
  };

  // @ts-ignore
  axios.get.mockResolvedValue(axiosData);

  // @ts-ignore
  Preferences.get.mockReturnValue(false);

  // @ts-ignore
  Preferences.set.mockImplementation(() => {});

  expect(await RedditMemes.getMeme()).toEqual({
    imageUrl: 'URL',
    title: 'Title',
  });
});

test('get Meme fails network', async () => {
  // @ts-ignore
  axios.get.mockImplementation(() => Promise.reject(new Error('Error message')));

  expect(await RedditMemes.getMeme()).toEqual({
    title: 'An error occoured while retrieving a meme :(',
    imageUrl: 'https://i.kym-cdn.com/entries/icons/mobile/000/026/489/crying.jpg',
  });
});

test('get Meme fails running out of memes', async () => {
  const axiosData = {
    data: {
      data: {
        children: [{
          data: {
            stickied: true,
          },
        }],
      },
    },
  };

  // @ts-ignore
  axios.get.mockResolvedValue(axiosData);

  // @ts-ignore
  Preferences.get.mockReturnValue(false);

  // @ts-ignore
  Preferences.set.mockImplementation(() => {});

  expect(await RedditMemes.getMeme()).toEqual({
    title: 'Out of memes for now :(',
    imageUrl: 'https://i.kym-cdn.com/entries/icons/mobile/000/026/489/crying.jpg',
  });
});
