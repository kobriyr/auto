const Router = require('express').Router;
const authService = require('../services/auth');
const { authenticated } = require('../middleware');
const router = Router();

router.get('/current-user', authenticated, async (req, res) => {
  return res.status(200).send({success: true, user: req.user});
});

router.post('/login', async (req, res) => {
  const {token, user} = await authService.authenticate(req.body);
  return res.status(200).send({success: true, token, user});
});

module.exports = router;
