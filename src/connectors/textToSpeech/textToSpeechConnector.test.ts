import * as TextToSpeechV1 from 'ibm-watson/text-to-speech/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import { EventEmitter } from 'events';

import TextToSpeechConnector from './textToSpeechConnector';

const synthesizeFunction = jest.fn();
jest.mock('ibm-watson/text-to-speech/v1', () => jest.fn(() => ({
  synthesizeUsingWebSocket: synthesizeFunction,
})));
jest.mock('ibm-watson/auth');


test('connector creation', () => {
  process.env.TEXT_TO_SPEECH_APIKEY = 'tts-key';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const connector = new TextToSpeechConnector();

  expect(IamAuthenticator).toHaveBeenCalledWith({ apikey: 'tts-key' });
  expect(TextToSpeechV1).toHaveBeenCalled();
});

describe('synthesizing speech', () => {
  let textToSpeechEmitter;
  beforeEach(() => {
    textToSpeechEmitter = new EventEmitter();
    synthesizeFunction.mockImplementationOnce(() => {
      // @ts-ignore
      textToSpeechEmitter.pipe = () => {};
      return textToSpeechEmitter;
    });
  });

  test('with success', async () => {
    const ttsFile = new TextToSpeechConnector().synthesize('foo bar');

    textToSpeechEmitter.emit('close');

    expect((await ttsFile).endsWith('.ogg')).toEqual(true);
    expect(synthesizeFunction.mock.calls[0][0].text).toEqual('foo bar');
  });

  test('with error', () => {
    const ttsFile = new TextToSpeechConnector().synthesize('foo bar');

    textToSpeechEmitter.emit('error', new Error('foo error'));

    expect(ttsFile).rejects.toEqual(new Error('foo error'));
  });
});
