const {Model} = require('../models');
const {ObjectId} = require('mongoose').Types;

class ModelService {
  async index (brandId) {
    return Model.find({
      brandId: ObjectId(brandId)
    }).sort({ name: 1 })
  }
}

module.exports = new ModelService();
