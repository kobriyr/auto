const Router = require('express').Router;
const modelService = require('../services/model');
const { authenticated } = require('../middleware');
const router = Router();

router.get('/', authenticated, async (req, res) => {
  const data = await modelService.index(req.query.brandId);
  return res.status(200).send(data);
});

module.exports = router;
