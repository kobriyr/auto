const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports.Model = mongoose.model('Model', mongoose.Schema({
  name: String,
  riaId: String,
  allowedYears: {
    type: Array,
    default: [],
  }
}));
