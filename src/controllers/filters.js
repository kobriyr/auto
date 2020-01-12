const Router = require('express').Router;
const filterService = require('../services/filter');
const { authenticated } = require('../middleware');
const router = Router();

router.get('/', authenticated, async (req, res) => {
  const { filters, count } = await filterService.index(req.user, req.query);
  res.set({
    'Access-Control-Expose-Headers': 'x-total-count',
    'x-total-count': count
  });
  return res.status(200).send(filters);
});

module.exports = router;
