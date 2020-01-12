const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports.Filter = mongoose.model('Filter', mongoose.Schema({
  user:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  brand:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  model:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model'
  },
  year: Number,
  price: Number,
  active: {
    type: Boolean,
    default: true,
  },
}));
