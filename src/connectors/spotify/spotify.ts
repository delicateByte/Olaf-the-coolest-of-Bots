import * as dotenv from 'dotenv';
import * as express from 'express';
import { CronJob } from 'cron';

import * as SpotifyWebApi from 'spotify-web-api-node';

dotenv.config();

export default class Spotify {
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
    Spotify.spotifyApi.authorizationCodeGrant(req.query.code).then((data) => {
      if (data.statusCode === 200) {
        // Received access and refresh token
        Spotify.spotifyApi.setAccessToken(data.body.access_token);
        Spotify.spotifyApi.setRefreshToken(data.body.refresh_token);

        if (Spotify.tokenRefresher) {
          Spotify.tokenRefresher.stop();
        }

        Spotify.tokenRefresher = new CronJob('*/5 * * * *', () => {
          Spotify.spotifyApi.refreshAccessToken().then((data) => {
              Spotify.spotifyApi.setAccessToken(data.body['access_token']);
            }).catch((err) => {
              console.log(err);
              return {}
            });
        }, null);
        Spotify.tokenRefresher.start();

        return res.redirect('/');
      }
    }).catch((err) => console.log(err));
  }

  static authRoute(req: express.Request, res: express.Response) {    
    return res.redirect(Spotify.spotifyApi.createAuthorizeURL(['user-read-private', 'user-top-read']));
  }

  static getUserInfo() {
    if (Spotify.isAuthorized()) {
      const userInfo = Spotify.spotifyApi.getMe().then((data) => data.body).catch(err => {
        console.log(err);
        return {}; 
      });
      return userInfo;
    }
    return {};
  }

  static async getTrack(category: string) {    
    const track = Spotify.spotifyApi.getPlaylistsForCategory(category, {
      country: 'DE',
      limit : 50,
      offset : 0,
    }).then((data) => {
      const playlists = data.body.playlists.items;

      return Spotify.spotifyApi.getPlaylistTracks(playlists[Math.round(Math.random() * (playlists.length - 1))].id);
    }).then((data) => {      
      const tracks = data.body.items;
      const trackRaw = tracks[Math.round(Math.random() * (tracks.length - 1))].track;
      const trackParsed = {
        name: trackRaw.name,
        artist: trackRaw.artists.map((artist) => artist.name).join(', '),
        url: trackRaw.external_urls.spotify,
      };

      return trackParsed;
    }).catch((err) => {
      console.log(err);
      return {}
    });

    return track;
  }
}
