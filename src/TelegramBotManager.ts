import * as TelegramBot from 'node-telegram-bot-api';

// const
let telegramBot;

export function initializeTelegramBot() {
  telegramBot = new TelegramBot(process.env.BOT_TOKEN_TEST, { polling: true });
}


export function getTelegrambotInstance() {
  return telegramBot;
}
