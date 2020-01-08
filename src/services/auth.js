const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../configs/index');
const {User} = require('../models');

class AuthService {
  createSalt() {
    return crypto.randomBytes(128).toString('base64');
  }

  hashPassword(password) {
    return bcrypt.hash(password, config.app.security.hash_complexity);
  }

  passwordMatches(newPassword, oldPassword) {
    return bcrypt.compare(newPassword, oldPassword);
  }

  async authenticate(data) {
    let user = await this.getUser(data);

    const matches = await this.passwordMatches(`${data.password}${user.salt}`, user.password);
    if (!matches) {
      throw new Error('Wrong email or password!');
    }

    return { token: jwt.sign({_id: user._id}, config.app.security.token), user: { ...user.toJSON(), password: undefined, salt: undefined } };
  }

  async getUser(data) {
    const user = await User.findOne({ email: {'$regex': `^${data.email.trim().replace('+', '\\+')}$`, '$options': 'i'} }).exec();

    if (!user) {
      throw new Error('Wrong email or password!');
    }
    return user;
  }

  async validateToken(token) {
    let decodedToken = false;
    try {
      decodedToken = jwt.verify(token, config.app.security.token);
    } catch(error) {
      throw new Error('Token not valid!');
    }

    return decodedToken;
  }
}

module.exports = new AuthService();
