const fs = require('fs');
const path = require('path');
const KEYS = require('../consts/keys');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(KEYS.telegram, {polling: true});

bot.on('message', async (msg) => {
  let allChats = await module.exports.getChats();
  const chatId = msg.chat.id;

  if (msg && msg.text === 'on') {
    if (!allChats.includes(chatId)) {
      allChats.push(chatId);
      await fs.writeFileSync(path.join(__dirname, '../db/chats.txt'), allChats.reduce((acc, number, index) => index ? acc += `,${number}` : acc = `${number}`, ''), 'utf8');
      await bot.sendMessage(chatId, 'Added!');
    }
  } else if (msg && msg.text === 'off') {
    if (allChats.includes(chatId)) {
      allChats = allChats.filter(chat => chat !== chatId);
      await fs.writeFileSync(path.join(__dirname, '../db/chats.txt'), allChats.reduce((acc, number, index) => index ? acc += `,${number}` : acc = `${number}`, ''), 'utf8');
      await bot.sendMessage(chatId, 'Deleted!');
    }
  }
});

module.exports.getChats = async () => {
  const chatsInfo = await fs.readFileSync(path.join(__dirname, '../db/chats.txt'), 'utf8');
  return (chatsInfo || '').split(',').filter(item => item) || [];
};