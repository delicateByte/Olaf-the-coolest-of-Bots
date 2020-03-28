import UnsplashConnector from '../../connectors/unsplash/unsplashConnector';
import UnsplashImage from '../../connectors/unsplash/unsplashImage';
import WikipediaConnector from '../../connectors/wikipedia/wikipediaConnector';
import GoogleMapsStaticConnector from '../../connectors/googleMapsStaticConnector/googleMapsStaticConnector';
import Preferences from '../../preferences';
import UseCase from '../../interfaces/useCase';
import TelegramMessage from '../../classes/TelegramMessage';
import UseCaseResponse from '../../classes/UseCaseResponse';
import TextResponse from '../../classes/TextResponse';


export default class ImageofthedayUsecase implements UseCase {
  useCaseName = 'Image of the Day';

  private unsplash = new UnsplashConnector(process.env.UNSPLASH_TOKEN);

  private wikipedia = new WikipediaConnector();

  private maps = new GoogleMapsStaticConnector(process.env.GOOGLE_TOKEN);

  async receiveMessage(arg: TelegramMessage | void): Promise<UseCaseResponse[]> {
    Preferences.set('imageoftheday', 'imageofthedayRandom', false);
    Preferences.set('imageoftheday', 'imageofthedayTags', 'forest, ocean, city');

    const chooseRandomImage = Preferences.get('imageoftheday', 'imageofthedayRandom');
    const imageTags = Preferences.get('imageoftheday', 'imageofthedayTags');
    let query;
    if (!chooseRandomImage && imageTags && imageTags.length) {
      query = ImageofthedayUsecase.drawRandomItem<string>(imageTags.split(',')).trim();
      console.log(`Choosing random image using tag "${query}"`);
    } else {
      query = '';
      console.log('Choosing random image');
    }

    const image = await this.unsplash.getRandomImage(query);
    const article = await this.getArticleForImage(image);
    const imagePath = await this.unsplash.downloadImage(image);
    const mapImagePath = await this.downloadMap(image);

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

    const response = new TextResponse();
    response.responseMessage = image.description;
    return [response];
  }

  private async getArticleForImage(image: UnsplashImage) : Promise<string> {
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
        const results = await this.wikipedia.search(query);
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
        const results = await this.wikipedia.search(tag);
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

    return this.wikipedia.getFirstParagraph(pageid);
  }

  private async downloadMap(image: UnsplashImage) : Promise<string> {
    if (image.coordinates) {
      return this.maps.getMapImage(image.coordinates);
    }
    if (image.location) {
      return this.maps.getMapImage(image.location);
    }
    return Promise.resolve(null);
  }

  private static drawRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // eslint-disable-next-line class-methods-use-this
  resetUseCase(): void { }
}
