const Router = require('express').Router;
const carService = require('../services/cars');
const { authenticated } = require('../middleware');
const router = Router();

router.get('/average-price', authenticated, async (req, res) => {
  const price = await carService.getAveragePrice(req.query);
  return res.status(200).send({ price });
});

module.exports = router;
