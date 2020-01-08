const { TelegramChat } = require('../models');

module.exports.getChats = async () => {
  const chats = await TelegramChat.find({ active: true });
  return chats.map(({ chatId }) => chatId);
};