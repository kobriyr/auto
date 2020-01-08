const authService = require('../services/auth');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || (req.headers['authorization'] || '').replace('Bearer', '').trim();

  if (!token) {
    res.status(401);
    return res.json({success: false, message: res.__('Invalid token.')});
  }

  req.token = token;

  try {
    const user = await authService.validateToken(token);
    req.user = await User.findOne({ _id: user._id }, { email: 1, firstName: 1, lastName: 1, _id: 0 });
    next();
  } catch (error) {
    res.status(401).json({success: false, message: res.__('Invalid Token.')});
  }
};
