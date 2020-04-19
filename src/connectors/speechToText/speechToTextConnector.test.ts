import * as SpeechToTextV1 from 'ibm-watson/speech-to-text/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import { EventEmitter } from 'events';

import SpeechToTextConnector from './speechToTextConnector';

jest.mock('ibm-watson/speech-to-text/v1');
jest.mock('ibm-watson/auth');


test('connector creation', () => {
  process.env.SPEECH_TO_TEXT_APIKEY = 'sst-key';

  // eslint-disable-next-line no-new
  new SpeechToTextConnector();

  expect(IamAuthenticator).toHaveBeenCalledWith({ apikey: 'sst-key' });
  expect(SpeechToTextV1).toHaveBeenCalled();
});

describe('recognizing speech', () => {
  let speechToTextEmitter;
  let voiceStream;
  beforeEach(() => {
    speechToTextEmitter = new EventEmitter();
    voiceStream = {
      pipe: jest.fn().mockReturnValue(speechToTextEmitter),
    };
  });

  test('with success', () => {
    const recognizedText = new SpeechToTextConnector().recognize(voiceStream);

    speechToTextEmitter.emit('data', 'foo');
    speechToTextEmitter.emit('data', 'bar');
    speechToTextEmitter.emit('end');

    expect(recognizedText).resolves.toEqual('foobar');
  });

  test('with error', () => {
    const recognizedText = new SpeechToTextConnector().recognize(voiceStream);

    speechToTextEmitter.emit('error', new Error('foo error'));

    expect(recognizedText).rejects.toEqual(new Error('foo error'));
  });
});
