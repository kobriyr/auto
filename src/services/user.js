const {User} = require('../models');

class UserService {
  async getByEmail(email) {
    if (!email) {
      return false;
    }
    return User.findOne({
      email: {'$regex': `^${email.trim().replace('+', '\\+')}$`, '$options': 'i'}
    }).exec();
  }


  async create(data) {
    const authService = require('./auth');
    if (!data.email || !data.password) {
      throw new Error('Missing information');
    }

    data.salt = authService.createSalt();
    const exists = await this.getByEmail(data.email);
    if (exists) {
      throw new Error('User already exist!');
    }
    const password = await authService.hashPassword(`${data.password}${data.salt}`);
    await User({
      email: data.email,
      password,
      salt: data.salt,
      firstName: data.firstName,
      lastName: data.lastName,
      active: true,
    }).save();

    return true;
  }
}

module.exports = new UserService();
