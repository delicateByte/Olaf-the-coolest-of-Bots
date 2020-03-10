// Importsv
import * as dotenv from 'dotenv';
import * as TelegramBot from 'node-telegram-bot-api';

// Importing prefe
// eslint-disable-next-line import/no-unresolved, import/extensions
import preferencesDashboard from './preferences-dashboard';

const NodeGeocoder = require('node-geocoder');
const https = require('https');
const http = require('http');

// Setup dotenv config
dotenv.config();

// Setup telegram bot
const telegramBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Setup preferences dashboard
const dashboard = preferencesDashboard;
dashboard.listen(process.env.PORT, () => {
  console.log(`Dashboard is running in http://localhost:${process.env.PORT}`);
});


const geocoderOptions = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyBQl5zPgrZ4YsXDIYo6CWMRrGNlmmlLy4o', // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(geocoderOptions);

const googleKnowledgeOptions = {
  host: 'kgsearch.googleapis.com',
  path: `/v1/entities:search?key=${geocoderOptions.apiKey}&limit=1&types=City&types=Place`,
  headers: {
    Accept: 'application/json',
  },
};

let city;
let countryCode;
let country;


// Telegram bot
telegramBot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // check if the message contains a location
  if (msg.location) {
    // use google geocoder to reverse-search the location's city and country
    geocoder.reverse({ lat: msg.location.latitude, lon: msg.location.longitude },
      (err, resLocation) => {
        city = resLocation[0].city;
        country = resLocation[0].country;
        countryCode = resLocation[0].countryCode;

        // send a message to the user containing city and country
        telegramBot.sendMessage(chatId, `You're located in ${city}, ${country}.`);

        googleKnowledgeOptions.path += (`&query=${city}`);

        let info = '';

        // use google knowledge base to get short description of city
        https.get(googleKnowledgeOptions, (resInfo) => {
          resInfo.setEncoding('utf8');
          resInfo.on('data', (chunk) => {
            info += chunk;
          });

          resInfo.on('end', () => {
            info = JSON.parse(info).itemListElement[0].result.detailedDescription.articleBody;
            // send short description to user
            telegramBot.sendMessage(chatId, info);
          });
        });

        let phone = '';

        http.get(`http://emergencynumberapi.com/api/country/${countryCode}`, (resNumber) => {
          resNumber.setEncoding('utf8');

          resNumber.on('data', (chunk) => {
            phone += chunk;
          });

          resNumber.on('end', () => {
            console.log(typeof phone);
          });
        });
      });
  }

  // send a message to the chat acknowledging receipt of their message
  // telegramBot.sendMessage(chatId, 'Received your message');
});
