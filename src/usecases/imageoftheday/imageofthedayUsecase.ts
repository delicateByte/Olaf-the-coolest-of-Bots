import UnsplashConnector from '../../connectors/unsplash/unsplashConnector';
import UnsplashImage from '../../connectors/unsplash/unsplashImage';
import WikipediaConnector from '../../connectors/wikipedia/wikipediaConnector';

const unsplash = new UnsplashConnector(process.env.UNSPLASH_TOKEN);
const wikipedia = new WikipediaConnector();

async function getArticleForImage(image: UnsplashImage) : Promise<string> {
  let pageid;

  // Try to find a suitable article using the location name
  // The first part that returns an article will be used
  // Parts are separated by a comma
  //
  // Example Location: San Francisco, California, United States
  //    1st try: San Francisco, California, United States
  //    2nd try: California, United States
  //    3rd try: United States
  if (image.location) {
    let query = image.location;

    do {
      console.log(`Using location ${query}`);
      // eslint-disable-next-line no-await-in-loop
      const results = await wikipedia.search(query);
      if (results.length) {
        [pageid] = results;
        break;
      }

      query = query.substring(query.indexOf(',') + 1);
    } while (query.includes(','));
  }

  // If no article was found using location, search by tags returned from Unsplash
  // The first tag that returns an article will be used
  if (!pageid) {
    // eslint-disable-next-line no-restricted-syntax
    for (const tag of image.tags) {
      console.log(`Using tag ${tag}`);
      // eslint-disable-next-line no-await-in-loop
      const results = await wikipedia.search(tag);
      if (results.length) {
        [pageid] = results;
        break;
      }
    }
  }

  // No suitable article was found
  if (!pageid) {
    return 'No description found';
  }

  return wikipedia.getFirstParagraph(pageid);
}

(async () => {
  const image = await unsplash.getRandomImage('nature');
  console.log('Image:', image);
  console.log(await getArticleForImage(image));
})();
