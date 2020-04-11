import * as express from 'express';
import { CronJob } from 'cron';
import * as SpotifyWebApi from 'spotify-web-api-node';
import Preferences from '../../core/preferences';


export default class Spotify {
  constructor() {
    if (!('SPOTIFY_CLIENT_ID' in process.env)) {
      throw new Error('Missing SPOTIFY_CLIENT_ID');
    }
    if (!('SPOTIFY_CLIENT_SECRET' in process.env)) {
      throw new Error('Missing SPOTIFY_CLIENT_SECRET');
    }
    if (!('SPOTIFY_REDIRECT_URI' in process.env)) {
      throw new Error('Missing SPOTIFY_REDIRECT_URI');
    }
  }

  private static spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });

  private static tokenRefresher: CronJob;

  static isAuthorized() {
    if (Spotify.spotifyApi.getAccessToken()) {
      return true;
    }
    return false;
  }

  static async callbackRoute(req: express.Request, res: express.Response) {
    Spotify.spotifyApi.authorizationCodeGrant(req.query.code).then((authData) => {
      if (authData.statusCode === 200) {
        // Received access and refresh token
        Spotify.spotifyApi.setAccessToken(authData.body.access_token);
        Spotify.spotifyApi.setRefreshToken(authData.body.refresh_token);

        if (Spotify.tokenRefresher) {
          Spotify.tokenRefresher.stop();
        }

        Spotify.tokenRefresher = new CronJob('*/5 * * * *', () => {
          Spotify.spotifyApi.refreshAccessToken().then((refreshData) => {
            Spotify.spotifyApi.setAccessToken(refreshData.body.access_token);
          }).catch((err) => {
            console.log(err);
            return {};
          });
        }, null);
        Spotify.tokenRefresher.start();
      }
      return res.redirect('/');
    }).catch((err) => console.log(err));
  }

  static authRoute(req: express.Request, res: express.Response) {
    return res.redirect(Spotify.spotifyApi.createAuthorizeURL(['user-read-private', 'user-top-read']));
  }

  static getUserInfo() {
    if (Spotify.isAuthorized()) {
      const userInfo = Spotify.spotifyApi.getMe().then((data) => data.body).catch((err) => {
        console.log(err);
        return {};
      });
      return userInfo;
    }
    return {};
  }

  static async getPlaylist() {
    if (Spotify.isAuthorized()) {
      const playlist = await Spotify.spotifyApi.getPlaylistsForCategory(Preferences.get('spotify', 'spotifyCategory'), {
        country: 'DE',
        limit: 50,
        offset: 0,
      }).then((data) => {
        const playlists = data.body.playlists.items;
        const playlistRaw = playlists[Math.round(Math.random() * (playlists.length - 1))];
        const playlistParsed = {
          name: playlistRaw.name,
          author: playlistRaw.owner.display_name,
          description: playlistRaw.description,
          url: playlistRaw.external_urls.spotify,
        };

        return playlistParsed;
      }).catch((err) => {
        console.log(err);
        return null;
      });

      return playlist;
    }
    return null;
  }
}
