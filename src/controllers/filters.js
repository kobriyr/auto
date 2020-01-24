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

router.post('/', authenticated, async (req, res) => {
  const model = await filterService.create(req.body, req.user);
  return res.status(200).send({ model });
});

router.get('/:filter_id', authenticated, async (req, res) => {
  try {
    const filter = await filterService.get(req.params.filter_id, req.user);
    return res.status(200).send(filter);
  } catch (e) {
    console.log('Error', e.message);
    return res.status(400).send(e.message);
  }
});

module.exports = router;
