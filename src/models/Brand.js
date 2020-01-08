const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports.Brand = mongoose.model('Brand', mongoose.Schema({
  name: String,
  riaId: String,
}));
