/* eslint-disable import/first */
import Entertainment from './entertainment';
import ProcessedTelegramMessage from '../../classes/ProcessedTelegramMessage';
import EndUseCaseResponse from '../../classes/EndUseCaseResponse';
import TextResponse from '../../classes/TextResponse';
import ImageResponse from '../../classes/ImageResponse';

jest.mock('../../connectors/reddit/redditMemes');
import RedditMemes from '../../connectors/reddit/redditMemes';

jest.mock('../../connectors/chucknorris/chucknorris');
import ChuckNorris from '../../connectors/chucknorris/chucknorris';

jest.mock('../../connectors/spotify/spotify');
import Spotify from '../../connectors/spotify/spotify';

test('get Meme', async () => {
  const entertainment = new Entertainment();

  const message = new ProcessedTelegramMessage({
    message_id: 42,
    from: {
      id: 1234567890,
      is_bot: false,
      first_name: 'Max',
      username: 'max_mustermann',
      language_code: 'de',
    },
    chat: {
      id: 1234567890,
      first_name: 'Max',
      username: 'max_mustermann',
      type: 'private',
    },
    date: 1586446007,
    text: 'Send me a meme',
  });
  message.text = message.originalMessage.text;

  // @ts-ignore
  RedditMemes.getMeme.mockResolvedValue({
    title: 'Title',
    imageUrl: 'URL',
  });

  const reciever = entertainment.receiveMessage(message);

  expect((await reciever.next()).value).toEqual(new TextResponse('Fresh meme serving you hot...'));
  expect((await reciever.next()).value).toEqual(new TextResponse('Title'));
  expect((await reciever.next()).value).toEqual(new ImageResponse('URL'));
  expect((await reciever.next()).value).toEqual(new EndUseCaseResponse());
});

test('get Joke', async () => {
  const entertainment = new Entertainment();

  const message = new ProcessedTelegramMessage({
    message_id: 42,
    from: {
      id: 1234567890,
      is_bot: false,
      first_name: 'Max',
      username: 'max_mustermann',
      language_code: 'de',
    },
    chat: {
      id: 1234567890,
      first_name: 'Max',
      username: 'max_mustermann',
      type: 'private',
    },
    date: 1586446007,
    text: 'Send me a joke',
  });
  message.text = message.originalMessage.text;

  // @ts-ignore
  ChuckNorris.getJoke.mockResolvedValue({ joke: 'A Chuck Norris Joke' });

  const reciever = entertainment.receiveMessage(message);

  expect((await reciever.next()).value).toEqual(new TextResponse('Asking Chuck Norris for a fact...'));
  expect((await reciever.next()).value).toEqual(new TextResponse('A Chuck Norris Joke'));
  expect((await reciever.next()).value).toEqual(new EndUseCaseResponse());
});

test('get Playlist', async () => {
  const entertainment = new Entertainment();

  const message = new ProcessedTelegramMessage({
    message_id: 42,
    from: {
      id: 1234567890,
      is_bot: false,
      first_name: 'Max',
      username: 'max_mustermann',
      language_code: 'de',
    },
    chat: {
      id: 1234567890,
      first_name: 'Max',
      username: 'max_mustermann',
      type: 'private',
    },
    date: 1586446007,
    text: 'Send me a playlist',
  });
  message.text = message.originalMessage.text;

  // @ts-ignore
  Spotify.getPlaylist.mockResolvedValue({
    description: 'Description',
    name: 'Name',
    author: 'Author',
    url: 'URL',
  });

  const reciever = entertainment.receiveMessage(message);

  expect((await reciever.next()).value).toEqual(new TextResponse('Getting you some beats...'));
  expect((await reciever.next()).value).toEqual(new TextResponse('"Description"\n"Name" by Author\nURL'));
  expect((await reciever.next()).value).toEqual(new EndUseCaseResponse());
});

test('get Playlist fails', async () => {
  const entertainment = new Entertainment();

  const message = new ProcessedTelegramMessage({
    message_id: 42,
    from: {
      id: 1234567890,
      is_bot: false,
      first_name: 'Max',
      username: 'max_mustermann',
      language_code: 'de',
    },
    chat: {
      id: 1234567890,
      first_name: 'Max',
      username: 'max_mustermann',
      type: 'private',
    },
    date: 1586446007,
    text: 'Send me a playlist',
  });
  message.text = message.originalMessage.text;

  // @ts-ignore
  Spotify.getPlaylist.mockResolvedValue(null);

  const reciever = entertainment.receiveMessage(message);

  expect((await reciever.next()).value).toEqual(new TextResponse('Getting you some beats...'));
  expect((await reciever.next()).value).toEqual(new TextResponse('Could not retrieve a playlist, please log into the dashboard to connect your account.'));
  expect((await reciever.next()).value).toEqual(new EndUseCaseResponse());
});

test('test reset', () => {
  const entertainment = new Entertainment();

  expect(entertainment.reset()).toBeUndefined();
});
