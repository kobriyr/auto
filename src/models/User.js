const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports.User = mongoose.model('User', mongoose.Schema({
  email: String,
  password: String,
  salt: {
    type: String,
    default: ''
  },
  firstName: String,
  lastName: String,
  apiKey: String,
  active: {
    type: Boolean,
    default: false,
  },
}));
