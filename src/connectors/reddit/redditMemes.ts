/* eslint-disable import/extensions, import/no-unresolved */
import Axios from 'axios';
import Preferences from '../../core/preferences';

export default class RedditMemes {
  static async getMeme() {
    const postJson = await Axios.get(`https://www.reddit.com/${Preferences.get('redditMemes', 'redditSubName')}.json?limit=50`).then((res) => {
      const posts = res.data.data.children.map((post) => post.data);

      do {
        const post = posts[0];

        const postsShown = (Preferences.get('redditMemes', 'shown')) ? JSON.parse(Preferences.get('redditMemes', 'shown')) : [];

        // Skip posts if they are already sent, sticky (usually mod posts) or not an image
        if (post.stickied || postsShown.includes(post.id) || post.post_hint !== 'image') {
          posts.shift();
        } else {
          // Found meme to send
          // Remember the meme to not send it again
          postsShown.push(post.id);
          Preferences.set('redditMemes', 'shown', JSON.stringify(postsShown));

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
