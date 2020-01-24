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

router.put('/:filter_id', authenticated, async (req, res) => {
  const model = await filterService.update(req.params.filter_id, req.body, req.user);
  return res.status(200).send({ model });
});

router.delete('/:filter_id', authenticated, async (req, res) => {
  try {
    await filterService.delete(req.params.filter_id, req.user);
    return res.status(200).send({ success: true });
  } catch (e) {
    console.log('Error', e.message);
    return res.status(400).send({ success: false, info: e.message});
  }
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
