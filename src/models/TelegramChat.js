const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports.TelegramChat = mongoose.model('TelegramChat', mongoose.Schema({
  chatId: String,
  active: {
    type: Boolean,
    default: true
  },
}));
