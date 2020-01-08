const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports.Model = mongoose.model('Model', mongoose.Schema({
  name: String,
  riaId: String,
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  allowedYears: {
    type: Array,
    default: [],
  }
}));
