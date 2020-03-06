// Imports
import * as dotenv from 'dotenv';
import * as TelegramBot from 'node-telegram-bot-api';

// Importing prefe
// eslint-disable-next-line import/no-unresolved, import/extensions
import preferencesDashboard from './dashboard/preferences-dashboard';


// Setup dotenv config
dotenv.config();

// Setup telegram bot
const telegramBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Setup preferences dashboard
const dashboard = preferencesDashboard;
dashboard.listen(process.env.PORT, () => {
  console.log(`Dashboard is running in http://localhost:${process.env.PORT}`);
});


// Telegram bot
telegramBot.on('message', (msg) => {
  const chatId = msg.chat.id;

  console.log(msg);

  if (msg.text) {
    // Text
    telegramBot.sendMessage(chatId, `Received text: ${msg.text}`);
  } else if (msg.photo) {
    // Photo
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    telegramBot.getFile(fileId).then((data) => {
      const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${data.file_path}`;

      telegramBot.sendMessage(chatId, `Received photo: ${url}`);
    });
  } else if (msg.voice) {
    // Voice
    const fileId = msg.voice.file_id;

    telegramBot.getFile(fileId).then((data) => {
      const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${data.file_path}`;

      telegramBot.sendMessage(chatId, `Received voice: ${url}`);
    });
  }
});
