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

  async update (id, { brand, model, year, price }, user) {
    if (!brand || !model || !year || !price || !id) {
      throw new Error('Required parameters is missing');
    }

    const filter = await Filter.findById(id);

    if (!filter) {
      throw new Error('Required parameters is missing');
    }

    return filter.set({
      ...filter,
      brand,
      model,
      year,
      price,
    }).save();
  }

  async delete (id, user) {
    if (!id) {
      throw new Error('Required parameters is missing');
    }

    await Filter.remove({
      _id: id,
      user: user._id || user
    });
    return true;
  }
}

module.exports = new FilterService();
