const Router = require('express').Router;
const authController = require('./auth');
const router = Router();

router.use('/api/auth', authController);

module.exports = router;