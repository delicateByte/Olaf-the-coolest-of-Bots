import Axios from 'axios';
import Preferences from '../../core/preferences';

export default class RedditMemes {
  private static readonly catCryingUrl = 'https://i.kym-cdn.com/entries/icons/mobile/000/026/489/crying.jpg';
  static async getMeme() {
    const postJson = await Axios.get(`https://www.reddit.com/${Preferences.get('redditMemes', 'redditMemesSubName')}.json?limit=50`).then((res) => {
      const posts = res.data.data.children.map((post) => post.data);
      console.log(posts);

      do {
        const post = posts[0];
        const postsShown = (Preferences.get('redditMemes', 'redditMemesShown')) ? JSON.parse(Preferences.get('redditMemes', 'redditMemesShown')) : [];

        // Skip posts if they are already sent, sticky (usually mod posts) or not an image
        if (post.stickied || postsShown.includes(post.id) || post.post_hint !== 'image') {
          posts.shift();
        } else {
          // Found meme to send
          // Remember the meme to not send it again
          postsShown.push(post.id);
          Preferences.set('redditMemes', 'redditMemesShown', JSON.stringify(postsShown));

          return post;
        }
      } while (posts.length > 0);
      return undefined;
    }).catch((err) => {
      console.log(err.message);
      return {
        title: 'An error occoured while retrieving a meme :(',
        url: RedditMemes.catCryingUrl,
      };
    });

    if (postJson) {
      const memeJson = {
        imageUrl: postJson.url,
        title: postJson.title,
      };

      return memeJson;
    }

    return {
      title: 'Out of memes for now :(',
      imageUrl: RedditMemes.catCryingUrl,
    };
  }
}
