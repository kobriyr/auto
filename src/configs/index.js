require('dotenv').config();

module.exports = {
  app: {
    security: {
      token: process.env.TOKEN_SECRET,
      hash_complexity: 6,
    },
  }
};
