/* eslint-disable import/extensions, import/no-unresolved, no-continue */

import RedditMemes from '../../connectors/reddit/redditMemes';
import ChuckNorris from '../../connectors/chucknorris/chucknorris';
import Spotify from '../../connectors/spotify/spotify';

export default class Entertainment {
  static test() {
    RedditMemes.getMeme();
    ChuckNorris.getJoke();
    Spotify.getTrack('party');
  }
}
