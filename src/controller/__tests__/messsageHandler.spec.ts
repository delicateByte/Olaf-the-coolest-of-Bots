import messageHandler = require('../messageHandler');

const voiceMessage = {
  message_id: 101,
  from: {
    id: 1095064575,
    is_bot: false,
    first_name: 'Phillip',
    username: 'kiephil',
    language_code: 'de',
  },
  chat: {
    id: 1095064575,
    first_name: 'Phillip',
    username: 'kiephil',
    type: 'private',
  },
  date: 1583835649,
  voice: {
    duration: 1,
    mime_type: 'audio/ogg',
    file_id: 'AwACAgIAAxkBAANlXmdqAXw4bC5mAAGlG-8t1lFug7pOAALYBQACmek5S90SK43fmyS_GAQ',
    file_unique_id: 'AgAD2AUAApnpOUs',
    file_size: 3461,
  },
};
const textMessage = {
  message_id: 3,
  from: {
    id: 1095064575,
    is_bot: false,
    first_name: 'Phillip',
    username: 'kiephil',
    language_code: 'en',
  },
  chat: {
    id: 1095064575,
    first_name: 'Phillip',
    username: 'kiephil',
    type: 'private',
  },
  date: 1583338611,
  text: 'test',
};
const otherMessage = {};
const locationMessage = {
  message_id: 14,
  from: {
    id: 857438551,
    is_bot: false,
    first_name: 'Jan',
    language_code: 'en',
  },
  chat: { id: 857438551, first_name: 'Jan', type: 'private' },
  date: 1583940257,
  location: { latitude: 48.773573, longitude: 9.170805 },
};
test(' noneemptytest - Voice2', () => {
  expect((2 + 2)).toBe(4);
});
