import * as dotenv from 'dotenv';
import * as express from 'express';
import { CronJob } from 'cron';

import * as SpotifyWebApi from 'spotify-web-api-node';

dotenv.config();

export default class Spotify {
  private static spotifyApi: SpotifyWebApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });

  static async callbackRoute(req: express.Request, res: express.Response) {
    Spotify.spotifyApi.authorizationCodeGrant(req.query.code).then((data) => {
      if (data.statusCode === 200) {
        // Received access and refresh token
        Spotify.spotifyApi.setAccessToken(data.body.access_token);
        Spotify.spotifyApi.setRefreshToken(data.body.refresh_token);

        const job = new CronJob('*/5 * * * *', () => {
          Spotify.spotifyApi.refreshAccessToken().then(
            (data) => {
              Spotify.spotifyApi.setAccessToken(data.body['access_token']);
            },
            (err) => {
              console.log('Could not refresh access token', err);
            }
          );
        }, null, true);

        return res.redirect('/');
      }
    }).catch((err) => console.log(err));
  }

  static authRoute(req: express.Request, res: express.Response) {    
    return res.redirect(Spotify.spotifyApi.createAuthorizeURL(['user-read-private', 'user-top-read']));
  }
}
