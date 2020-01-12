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
      .limit(10);

    return {
      count: totalCount,
      filters
    };
  }
}

module.exports = new FilterService();
