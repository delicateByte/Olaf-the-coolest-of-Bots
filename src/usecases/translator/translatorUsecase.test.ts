import TranslatorUsecase from './translatorUsecase';
import ProcessedTelegramMessage from '../../classes/ProcessedTelegramMessage';
import TextResponse from '../../classes/TextResponse';

const mock = require('./mockMessages');


const mockGetLocationName = jest.fn();
jest.mock('../../connectors/googleGeocoder/googleGeocoderConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    getLocationName: mockGetLocationName,
  })),
}));

const mockGetLocationDescription = jest.fn();
jest.mock('../../connectors/googleKnowledgeBase/googleKnowledgeBaseConnector', () => ({
  default: jest.fn().mockImplementation(() => ({
    getLocationDescription: mockGetLocationDescription,
  })),
}));


process.env.GOOGLE_TOKEN = null;


test('Receiving message works', async () => {
  const processedMock = new ProcessedTelegramMessage(mock.location);
  processedMock.latitude = 48.8698679;
  processedMock.longitude = 2.3072976;

  const responses = await new TranslatorUsecase().receiveMessage(processedMock);

  mockGetLocationName.mockResolvedValue(['Paris', 'France', 'fr']);
  mockGetLocationDescription.mockResolvedValue(
    'Paris is the capital and most populous city of France, with a population '
    + 'of 2,148,271 residents in an area of 105 square kilometres. ',
  );


  expect((await responses.next()).value).toEqual(new TextResponse(
    "You're located in Paris, France. In case of emergency, "
    + 'call 112 (General), 15 (Ambulance), 17 (Police), or 18 (Fire)',
  ));

  expect((await responses.next()).value).toEqual(new TextResponse(
    'Paris is the capital and most populous city of France, with a population '
    + 'of 2,148,271 residents in an area of 105 square kilometres. ',
  ));

  expect((await responses.next()).value).toEqual(new TextResponse(
    'Your following (English) messages will be translated to the language of your '
    + 'location. To stop the translator, please type "!STOP" (without quotes).',
  ));
});


test('Send message to be translated where no location has been given', async () => {
  const processedText = new ProcessedTelegramMessage(mock.text);
  const responsesInfo = await new TranslatorUsecase().receiveMessage(processedText);

  expect((await responsesInfo.next()).value).toEqual(new TextResponse(
    'Please let me know where you are by sending your location.',
  ));
});
