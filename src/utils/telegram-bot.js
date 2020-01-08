require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
const vars = require('../../const/vars');

module.exports.sendMsg = async (chatId, message) => {
  await bot.sendMessage(process.env.APP_ENV === 'develop' ? vars.supportTelegtamChat : chatId, message);
};