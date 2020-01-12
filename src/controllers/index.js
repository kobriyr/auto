const Router = require('express').Router;
const authController = require('./auth');
const filtersController = require('./filters');
const brandController = require('./brand');
const modelController = require('./model');
const carController = require('./car');
const router = Router();

router.use('/api/auth', authController);
router.use('/api/filters', filtersController);
router.use('/api/brands', brandController);
router.use('/api/models', modelController);
router.use('/api/cars', carController);

module.exports = router;