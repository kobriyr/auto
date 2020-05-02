require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const vars = require('../../const/vars');

let BOT;

/**
 * Method for getting instance of telegram bot
 * @return {TelegramBot}
 */

function getBot () {
  if (!BOT) {
    BOT = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
  }

  return BOT;
}

module.exports.sendMsg = async (chatId, message) => {
  const bot = getBot();
  await bot.sendMessage(process.env.APP_ENV === 'develop' ? vars.supportTelegtamChat : chatId, message);
};
