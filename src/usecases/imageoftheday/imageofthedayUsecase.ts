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
import VoiceResponse from '../../classes/VoiceResponse';


export default class ImageofthedayUsecase implements UseCase {
  name = 'Image of the Day';
  triggers = ['image', 'photo', 'picture'];

  private unsplash = new UnsplashConnector(process.env.UNSPLASH_TOKEN);
  private wikipedia = new WikipediaConnector();
  private maps = new GoogleMapsStaticConnector(process.env.GOOGLE_TOKEN);

  constructor() {
    if (!('UNSPLASH_TOKEN' in process.env)) {
      throw new Error('Missing API key for Unsplash');
    }
    if (!('GOOGLE_TOKEN' in process.env)) {
      throw new Error('Missing API key for Google');
    }
  }

  async receiveMessage(message: TelegramMessage): Promise<UseCaseResponse[]> {
    // Get data from APIs
    const image = await this.unsplash.getRandomImage(ImageofthedayUsecase.getUnsplashQuery());
    const [,article] = await this.getArticleForImage(image);
    const imagePath = await this.unsplash.downloadImage(image);
    const mapImagePath = await this.downloadMap(image);

    // Assemble response
    const responses: UseCaseResponse[] = [new EndUseCaseResponse()];

    // Send extra message if use case was triggered proactively
    if (!message) {
      responses.push(new TextResponse('Here\'s your image of the day'));
    }

    // Show image and description
    responses.push(new ImageResponse(imagePath));
    responses.push(new TextResponse(ImageofthedayUsecase.assembleImageDescription(image)));

    // Read Wikipedia article if available
    if (article) {
      responses.push(new VoiceResponse(article));
    }

    // Show map excerpt if location was given
    if (mapImagePath) {
      responses.push(new ImageResponse(mapImagePath));
    }

    return responses;
  }

  private static getUnsplashQuery(): string {
    // Create query based on preferences
    const chooseRandomImage = Preferences.get('imageoftheday', 'imageofthedayRandom');
    const imageTags = Preferences.get('imageoftheday', 'imageofthedayTags');
    if (!chooseRandomImage && imageTags && imageTags.length) {
      return ImageofthedayUsecase.drawRandomItem<string>(imageTags.split(',')).trim();
    }
    return '';
  }

  private static assembleImageDescription(image: UnsplashImage): string {
    let text = '';
    text += `"${image.description}"\n\n`;
    text += `Image by ${image.userName}\n`;
    if (image.location) {
      text += `Shot in ${image.location}\n`;
    }
    text += `From ${image.postUrl}`;
    return text;
  }

  private async getArticleForImage(image: UnsplashImage) : Promise<[string, string]> {
    let pageid;
    let title;

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
          [[title, pageid]] = results;
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
          [[title, pageid]] = results;
          break;
        }
      }
    }

    // No suitable article was found
    if (!pageid) {
      return null;
    }

    const article = await this.wikipedia.getFirstParagraph(pageid);
    return [title, article];
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
