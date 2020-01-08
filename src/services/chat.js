const fs = require('fs');
const path = require('path');

module.exports.getChats = async () => {
  const chatsInfo = await fs.readFileSync(path.join(__dirname, '../db/chats.txt'), 'utf8');
  return (chatsInfo || '').split(',').filter(item => item) || [];
};