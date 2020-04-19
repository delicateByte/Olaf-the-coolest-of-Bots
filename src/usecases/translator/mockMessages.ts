import { Message } from 'node-telegram-bot-api';

const mockLocation : Message = {
  message_id: 378,
  from: {
    id: 741235876,
    is_bot: false,
    first_name: 'Michael',
    last_name: 'Müller',
    language_code: 'en',
  },
  chat: {
    id: 741235876,
    first_name: 'Michael',
    last_name: 'Müller',
    type: 'private',
  },
  date: 1587221585,
  location: { latitude: 48.8698679, longitude: 2.3072976 }, // <- Paris
};

const mockText : Message = {
  message_id: 386,
  from: {
    id: 741235876,
    is_bot: false,
    first_name: 'Michael',
    last_name: 'Müller',
    language_code: 'en',
  },
  chat: {
    id: 741235876,
    first_name: 'Michael',
    last_name: 'Müller',
    type: 'private',
  },
  date: 1587222617,
  text: 'Hello, how are you?',
};

exports.location = mockLocation;
exports.text = mockText;
