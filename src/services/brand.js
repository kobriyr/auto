const {Brand} = require('../models');

class BrandService {
  async index () {
    return Brand.find().sort({ name: 1 })
  }
}

module.exports = new BrandService();
