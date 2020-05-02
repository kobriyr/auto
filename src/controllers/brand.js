const Router = require('express').Router;
const brandService = require('../services/brand');
const { authenticated } = require('../middleware');
const router = Router();

router.get('/', authenticated, async (req, res) => {
  const brands = await brandService.index();
  return res.status(200).send(brands);
});

module.exports = router;
