import UnsplashConnector from '../../connectors/unsplash/unsplashConnector';
import UnsplashImage from '../../connectors/unsplash/unsplashImage';
import WikipediaConnector from '../../connectors/wikipedia/wikipediaConnector';
import GoogleMapsStaticConnector from '../../connectors/googleMapsStaticConnector/googleMapsStaticConnector';
import UseCase from '../../interfaces/useCase';
import TelegramMessage from '../../classes/TelegramMessage';
import UseCaseResponse from '../../classes/UseCaseResponse';
import TextResponse from '../../classes/TextResponse';
import Preferences from '../../core/preferences';
import ImageResponse from '../../classes/ImageResponse';
import EndUseCaseResponse from '../../classes/EndUseCaseResponse';


export default class ImageofthedayUsecase implements UseCase {
  name = 'Image of the Day';

  triggers = ['image'];

  private unsplash = new UnsplashConnector(process.env.UNSPLASH_TOKEN);

  private wikipedia = new WikipediaConnector();

  private maps = new GoogleMapsStaticConnector(process.env.GOOGLE_TOKEN);

  async receiveMessage(message: TelegramMessage): Promise<UseCaseResponse[]> {
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

    const responses: UseCaseResponse[] = [new ImageResponse(imagePath)];

    let text = '';
    text += `Image by ${image.userName}\n`;
    text += `URL: ${image.postUrl}\n`;
    if (image.location) {
      text += `Location: ${image.location}\n`;
    }
    text += `Description: ${image.description}\n\n`;
    text += article;
    responses.push(new TextResponse(text));

    if (mapImagePath) {
      responses.push(new ImageResponse(mapImagePath));
    }

    responses.push(new EndUseCaseResponse());

    return responses;
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
  reset(): void { }
}
