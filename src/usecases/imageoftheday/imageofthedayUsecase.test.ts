import Preferences from '../../core/preferences';
import ImageofthedayUsecase from './imageofthedayUsecase';
import TelegramMessageType from '../../classes/TelegramMessageType';
import UnsplashImage from '../../connectors/unsplash/unsplashImage';
import TextResponse from '../../classes/TextResponse';
import ImageResponse from '../../classes/ImageResponse';
import EndUseCaseResponse from '../../classes/EndUseCaseResponse';

const unsplashGetRandomImage = jest.fn();
const unsplashDownloadImage = jest.fn();
jest.mock('../../connectors/unsplash/unsplashConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    getRandomImage: unsplashGetRandomImage,
    downloadImage: unsplashDownloadImage,
  })),
}));

const wikipediaSearch = jest.fn();
const wikipediaGetFirstParagraph = jest.fn();
jest.mock('../../connectors/wikipedia/wikipediaConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    search: wikipediaSearch,
    getFirstParagraph: wikipediaGetFirstParagraph,
  })),
}));

const googleMapsGetMapImage = jest.fn();
jest.mock('../../connectors/googleMapsStatic/googleMapsStaticConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    getMapImage: googleMapsGetMapImage,
  })),
}));

jest.mock('../../core/preferences');

beforeEach(() => {
  jest.resetModules();
  unsplashGetRandomImage.mockReset();
  unsplashDownloadImage.mockReset();
  wikipediaSearch.mockReset();
  wikipediaGetFirstParagraph.mockReset();
  googleMapsGetMapImage.mockReset();
});

process.env.UNSPLASH_TOKEN = null;
process.env.GOOGLE_TOKEN = null;

test('receiving a message works', async () => {
  const responses = await new ImageofthedayUsecase().receiveMessage({
    originalMessage: undefined,
    type: TelegramMessageType.TEXT,
  });

  unsplashGetRandomImage.mockResolvedValue(new UnsplashImage(
    'Some description',
    'https://unsplash.com/photos/abc',
    'https://images.unsplash.com/photo-abc',
    'John Doe',
    ['first tag', 'second tag'],
    'Some location',
    [0, 0],
  ));
  unsplashDownloadImage.mockResolvedValue('path/to/image.png');
  wikipediaSearch.mockResolvedValue([['', 42]]);
  wikipediaGetFirstParagraph.mockResolvedValue('Article');
  googleMapsGetMapImage.mockResolvedValue('path/to/map.png');

  expect((await responses.next()).value).toEqual(new TextResponse('Here\'s your image'));
  expect((await responses.next()).value).toEqual(new ImageResponse('path/to/image.png'));
  expect((await responses.next()).value).toBeDefined();
  expect((await responses.next()).value).toEqual(new TextResponse('Article'));
  expect((await responses.next()).value).toEqual(new ImageResponse('path/to/map.png'));
  expect((await responses.next()).value).toEqual(new EndUseCaseResponse());
});

describe('get Unsplash query', () => {
  test('for random image', () => {
    // @ts-ignore
    Preferences.get.mockReturnValueOnce(true);
    // @ts-ignore
    expect(ImageofthedayUsecase.getUnsplashQuery()).toEqual('');
  });

  test('with tags', () => {
    // @ts-ignore
    Preferences.get.mockReturnValueOnce(false);
    // @ts-ignore
    Preferences.get.mockReturnValueOnce('tag 1');
    // @ts-ignore
    expect(ImageofthedayUsecase.getUnsplashQuery()).toEqual('tag 1');
  });
});

test('assembling an image description', () => {
  const image = new UnsplashImage('Description', 'https://unsplash.com/photos/abc',
    '', 'User', [], 'Location', null);

  // @ts-ignore
  const actual = ImageofthedayUsecase.assembleImageDescription(image);

  expect(actual).toEqual('"Description"\n\nImage by User\nShot in Location\nFrom https://unsplash.com/photos/abc');
});

describe('get article for image', () => {
  test('by location', async () => {
    const image = new UnsplashImage('', '', '', '', [],
      'San Francisco, California, United States', null);
    wikipediaSearch.mockReturnValueOnce([]);
    wikipediaSearch.mockReturnValueOnce([]);
    wikipediaSearch.mockReturnValueOnce([['Title', 42]]);
    wikipediaGetFirstParagraph.mockReturnValue('Article');

    // @ts-ignore
    const actual = await new ImageofthedayUsecase().getArticleForImage(image);

    expect(wikipediaSearch).toHaveBeenNthCalledWith(1, 'San Francisco, California, United States');
    expect(wikipediaSearch).toHaveBeenNthCalledWith(2, 'California, United States');
    expect(wikipediaSearch).toHaveBeenNthCalledWith(3, 'United States');
    expect(wikipediaGetFirstParagraph).toHaveBeenCalledWith(42);
    expect(actual).toEqual(['Title', 'Article']);
  });

  test('by tags', async () => {
    const image = new UnsplashImage('', '', '', '',
      ['tag 1', 'tag 2', 'tag 3'], 'not existing location', null);
    wikipediaSearch.mockReturnValueOnce([]);
    wikipediaSearch.mockReturnValueOnce([]);
    wikipediaSearch.mockReturnValueOnce([['Title', 42]]);
    wikipediaGetFirstParagraph.mockReturnValue('Article');

    // @ts-ignore
    const actual = await new ImageofthedayUsecase().getArticleForImage(image);

    expect(wikipediaSearch).toHaveBeenNthCalledWith(1, 'not existing location');
    expect(wikipediaSearch).toHaveBeenNthCalledWith(2, 'tag 1');
    expect(wikipediaSearch).toHaveBeenNthCalledWith(3, 'tag 2');
    expect(wikipediaGetFirstParagraph).toHaveBeenCalledWith(42);
    expect(actual).toEqual(['Title', 'Article']);
  });

  test('without results', async () => {
    const image = new UnsplashImage('', '', '', '',
      [], null, null);

    // @ts-ignore
    const actual = await new ImageofthedayUsecase().getArticleForImage(image);

    expect(wikipediaGetFirstParagraph).toBeCalledTimes(0);
    expect(actual).toEqual(null);
  });
});

describe('downloading a map image', () => {
  test('by coordinates', async () => {
    const image = new UnsplashImage('', '', '', '',
      [], null, [42.123, 12.45]);

    const usecase = new ImageofthedayUsecase();
    // @ts-ignore
    await usecase.downloadMap(image);
    // @ts-ignore
    expect(usecase.maps.getMapImage).toHaveBeenCalledWith(image.coordinates);
  });

  test('by location', async () => {
    const image = new UnsplashImage('', '', '', '',
      [], 'Location', null);

    const usecase = new ImageofthedayUsecase();
    // @ts-ignore
    await usecase.downloadMap(image);
    // @ts-ignore
    expect(usecase.maps.getMapImage).toHaveBeenCalledWith(image.location);
  });

  test('without location', async () => {
    const image = new UnsplashImage('', '', '', '',
      [], null, null);

    const usecase = new ImageofthedayUsecase();
    // @ts-ignore
    const actual = await usecase.downloadMap(image);
    // @ts-ignore
    expect(usecase.maps.getMapImage).toHaveBeenCalledTimes(0);
    expect(actual).toBeNull();
  });
});

test('drawing a random array item', async () => {
  const array = [1, 2, 42];
  // @ts-ignore
  expect(array.includes(ImageofthedayUsecase.drawRandomItem(array))).toBeTruthy();
});

test('reset', () => {
  expect(new ImageofthedayUsecase().reset()).toBeUndefined();
});
