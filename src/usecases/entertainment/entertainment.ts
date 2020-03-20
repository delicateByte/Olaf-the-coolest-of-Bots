/* eslint-disable import/extensions, import/no-unresolved, no-continue */

import RedditMemes from '../../connectors/reddit/redditMemes';

export default class Entertainment {
  static getMeme() {
    RedditMemes.getMeme();
  }
}
