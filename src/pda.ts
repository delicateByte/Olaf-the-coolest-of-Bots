// Imports
import * as dotenv from 'dotenv';
import * as TelegramBot from 'node-telegram-bot-api';
// Importing prefe
// eslint-disable-next-line import/no-unresolved, import/extensions
import preferencesDashboard from './preferences-dashboard';
import { MessageHandler } from './controller/messageHandler';


// Setup dotenv config
dotenv.config();

// Setup telegram bot
const telegramBot = new TelegramBot(process.env.BOT_TOKEN_TEST, { polling: true });

// Setup preferences dashboard
const dashboard = preferencesDashboard;
dashboard.listen(process.env.PORT, () => {
  console.log(`Dashboard is running in http://localhost:${process.env.PORT}`);
});


// Telegram bot
telegramBot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(msg);
  MessageHandler.classifyMessage(telegramBot,msg)
  // send a message to the chat acknowledging receipt of their message
  telegramBot.sendMessage(chatId, 'Received your message');
});
