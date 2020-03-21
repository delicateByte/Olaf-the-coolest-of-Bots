import UnsplashConnector from '../../connectors/unsplash/unsplashConnector';
import UnsplashImage from '../../connectors/unsplash/unsplashImage';
import WikipediaConnector from '../../connectors/wikipedia/wikipediaConnector';
import GoogleMapsStaticConnector from '../../connectors/googleMapsStaticConnector/googleMapsStaticConnector';
import Preferences from '../../preferences';


const unsplash = new UnsplashConnector(process.env.UNSPLASH_TOKEN);
const wikipedia = new WikipediaConnector();
const maps = new GoogleMapsStaticConnector(process.env.GOOGLE_TOKEN);

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
      // eslint-disable-next-line no-await-in-loop
      const results = await wikipedia.search(query);
      if (results.length) {
        [pageid] = results;
        break;
      }

      query = query.substring(query.indexOf(',') + 1).trim();
    } while (query.includes(','));
  }

  // If no article was found using location, search by tags returned from Unsplash
  // The first tag that returns an article will be used
  if (!pageid) {
    // eslint-disable-next-line no-restricted-syntax
    for (const tag of image.tags) {
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

async function downloadMap(image: UnsplashImage) : Promise<string> {
  if (image.coordinates) {
    return maps.getMapImage(image.coordinates);
  }
  if (image.location) {
    return maps.getMapImage(image.location);
  }
  return Promise.resolve(null);
}

function drawRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

(async () => {
  Preferences.set('usecase/imageoftheday', 'tags', 'forest, ocean, city');

  const imageTags = Preferences.get('usecase/imageoftheday', 'tags');
  let query;
  if (imageTags && imageTags.length) {
    query = drawRandomItem<string>(imageTags.split(',')).trim();
    console.log(`Choosing random image using tag "${query}"`);
  } else {
    query = '';
    console.log('Choosing random image');
  }

  const image = await unsplash.getRandomImage(query);
  const article = await getArticleForImage(image);
  const imagePath = await unsplash.downloadImage(image);
  const mapImagePath = await downloadMap(image);

  console.log();
  console.log('Image by', image.userName);
  console.log('URL:', image.postUrl);
  console.log('Local image path:', imagePath);
  console.log('Description:', image.description);
  if (image.location || image.coordinates) {
    console.log(`Location: ${image.location} (${image.coordinates})`);
    console.log('Local map path:', mapImagePath);
  } else {
    console.log('No location given');
  }

  console.log();
  console.log('Wikipedia Article:');
  console.log(article);
})();
