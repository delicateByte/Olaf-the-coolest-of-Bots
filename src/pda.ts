// Imports
import * as dotenv from 'dotenv';
// Importing prefe
// eslint-disable-next-line import/no-unresolved, import/extensions
import preferencesDashboard from './dashboard/preferences-dashboard';
import { classifyMessage } from './controller/messageHandler';
import { getTelegrambotInstance, initializeTelegramBot } from './TelegramBotManager';

// eslint-disable-next-line import/no-unresolved, import/extensions
import Entertainment from './usecases/entertainment/entertainment';

Entertainment.test();

// Setup dotenv config
dotenv.config();
// Setup Bot
initializeTelegramBot();

// Setup telegram bot
const telegramBot = getTelegrambotInstance();

// Setup preferences dashboard
const dashboard = preferencesDashboard;
dashboard.listen(process.env.PORT, () => {
  console.log(`Dashboard is running in http://localhost:${process.env.PORT}`);
});

// Telegram bot
telegramBot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(msg);
  classifyMessage(telegramBot, msg);
  // send a message to the chat acknowledging receipt of their message
  telegramBot.sendMessage(chatId, 'Received your message');
});
export default getTelegrambotInstance();
