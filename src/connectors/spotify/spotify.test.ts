/* eslint-disable import/order, import/first, @typescript-eslint/no-unused-vars */
import * as express from 'express';
import * as session from 'express-session';
import * as supertest from 'supertest';
import Spotify from './spotify';

jest.mock('spotify-web-api-node');

// Mock server
const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({
  extended: true,
}));

app.get('/callback', Spotify.callbackRoute);

const request = supertest(app);

test('isAuthorized fails', () => {
  // @ts-ignore
  Spotify.spotifyApi.getAccessToken.mockImplementationOnce(() => undefined);
  expect(Spotify.isAuthorized()).toBe(false);
});

test('isAuthorized', () => {
  // @ts-ignore
  Spotify.spotifyApi.getAccessToken.mockImplementationOnce(() => 'some_token');
  expect(Spotify.isAuthorized()).toBe(true);
});

test('getUserInfo fails no token', async () => {
  // @ts-ignore
  Spotify.spotifyApi.getAccessToken.mockImplementationOnce(() => undefined);
  expect(await Spotify.getUserInfo()).toEqual({});
});

test('getUserInfo', async () => {
  // @ts-ignore
  Spotify.spotifyApi.getAccessToken.mockImplementationOnce(() => 'some_token');
  // @ts-ignore
  Spotify.spotifyApi.getMe.mockImplementationOnce(() => Promise.resolve({ body: 'some_userdata' }));
  expect(await Spotify.getUserInfo()).toEqual('some_userdata');
});

test('getPlaylist fails no token', async () => {
  // @ts-ignore
  Spotify.spotifyApi.getAccessToken.mockImplementationOnce(() => undefined);
  expect(await Spotify.getPlaylist()).toBeNull();
});

test('getPlaylist fails getPlaylistsForCategory', async () => {
  // @ts-ignore
  Spotify.spotifyApi.getAccessToken.mockImplementationOnce(() => 'some_token');
  // @ts-ignore
  Spotify.spotifyApi.getPlaylistsForCategory.mockImplementationOnce((cat, opt) => Promise.reject());

  expect(await Spotify.getPlaylist()).toBeNull();
});

test('getPlaylist', async () => {
  // @ts-ignore
  Spotify.spotifyApi.getAccessToken.mockImplementationOnce(() => 'some_token');
  // @ts-ignore
  Spotify.spotifyApi.getPlaylistsForCategory.mockImplementationOnce((cat, opt) => Promise.resolve({
    body: {
      playlists: {
        items: [
          {
            name: 'name',
            owner: { display_name: 'author' },
            description: 'description',
            external_urls: { spotify: 'spotify' },
          },
        ],
      },
    },
  }));

  expect(await Spotify.getPlaylist()).toEqual({
    name: 'name',
    author: 'author',
    description: 'description',
    url: 'spotify',
  });
});

test('process.env missing SPOTIFY_CLIENT_ID', () => {
  const { SPOTIFY_CLIENT_ID } = process.env;
  expect(() => new Spotify()).toThrow();
  process.env.SPOTIFY_CLIENT_ID = SPOTIFY_CLIENT_ID;
});

test('process.env missing SPOTIFY_CLIENT_SECRET', () => {
  const { SPOTIFY_CLIENT_SECRET } = process.env;
  expect(() => new Spotify()).toThrow();
  process.env.SPOTIFY_CLIENT_SECRET = SPOTIFY_CLIENT_SECRET;
});

test('process.env missing SPOTIFY_REDIRECT_URI', () => {
  const { SPOTIFY_REDIRECT_URI } = process.env;
  expect(() => new Spotify()).toThrow();
  process.env.SPOTIFY_REDIRECT_URI = SPOTIFY_REDIRECT_URI;
});

test('callback route', async () => {
  let accessToken;
  let refreshToken;
  // @ts-ignore
  Spotify.spotifyApi.authorizationCodeGrant.mockImplementationOnce(() => Promise.resolve({
    body: {
      access_token: 'some_access_token',
      refresh_token: 'some_refresh_token',
    },
    statusCode: 200,
  }));
  // @ts-ignore
  Spotify.spotifyApi.setAccessToken.mockImplementationOnce((token) => {
    accessToken = token;
  });
  // @ts-ignore
  Spotify.spotifyApi.setRefreshToken.mockImplementationOnce((token) => {
    refreshToken = token;
  });
  // @ts-ignore
  Spotify.spotifyApi.getAccessToken.mockImplementationOnce(() => accessToken);
  // @ts-ignore
  Spotify.spotifyApi.getRefreshToken.mockImplementationOnce(() => refreshToken);

  await request.get('/callback');

  // @ts-ignore
  expect(Spotify.spotifyApi.getAccessToken()).toBe('some_access_token');
  // @ts-ignore
  expect(Spotify.spotifyApi.getRefreshToken()).toBe('some_refresh_token');
  // @ts-ignore
  Spotify.tokenRefresher.stop();
});

test('callback route fails invalid auth', async () => {
  // @ts-ignore
  Spotify.spotifyApi.authorizationCodeGrant.mockImplementationOnce(() => Promise.resolve({
    statusCode: 403,
  }));

  await request.get('/callback');

  // @ts-ignore
  expect(Spotify.spotifyApi.getAccessToken()).toBeUndefined();
  // @ts-ignore
  expect(Spotify.spotifyApi.getRefreshToken()).toBeUndefined();
});
