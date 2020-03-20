/* eslint-disable import/extensions, import/no-unresolved */
import { LocalStorage } from 'node-localstorage';
import Axios from 'axios';
import Preferences from '../../preferences';

const localStorage = new LocalStorage('./localstorage/uc_entertainment');

export default class RedditMemes {
  static async getMeme() {
    const postJson = await Axios.get(`https://www.reddit.com/${Preferences.get('redditMemes', 'subName')}.json?limit=50`).then((res) => {
      const posts = res.data.data.children.map((post) => post.data);

      do {
        const post = posts[0];

        // Skip posts if they are already sent, sticky (usually mod posts) or not an image
        if (post.stickied || post.id === localStorage.getItem(post.id) || post.post_hint !== 'image') {
          posts.shift();
        } else {
          // Found meme to send
          // Remember the meme to not send it again
          localStorage.setItem(post.id, post.id);

          return post;
        }
      } while (posts.length > 0);
      return undefined;
    });

    if (postJson) {
      const memeJson = {
        // postUrl: `https://reddit.com${postJson.permalink}`,
        imageUrl: postJson.url,
        title: postJson.title,
      };

      return memeJson;
    }

    return {
      title: 'Out of memes for now :(',
      imageUrl: 'https://i.kym-cdn.com/entries/icons/mobile/000/026/489/crying.jpg',
    };
  }
}
