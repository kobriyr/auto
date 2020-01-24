const {Filter} = require('../models');

class FilterService {
  async index (user, { sortBy, order, page, limit }) {
    const query = {
      user: user._id || user,
      active: true
    };

    const totalCount = await Filter.count(query);
    const filters = await Filter.find(query)
      .sort({[sortBy]: order})
      .skip(page*limit)
      .limit(10)
      .populate('brand')
      .populate('model')
      .lean();

    return {
      count: totalCount,
      filters
    };
  }

  async get (filter, user) {
    if (!filter) {
      throw new Error('Required parameters is missing');
    }

    const query = {
      user: user._id || user,
      _id: filter,
      active: true
    };

    return Filter.findOne(query);
  }

  async create ({ brand, model, year, price }, user) {
    if (!brand || !model || !year || !price) {
      return {};
    }

    return Filter({
      brand,
      model,
      year,
      price,
      user: user._id || user
    }).save();
  }
}

module.exports = new FilterService();
