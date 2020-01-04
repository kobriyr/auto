const express = require('express');
const request = require('superagent');
const router = express.Router();
const KEYS = require('../consts/keys');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(KEYS.telegram, {polling: true});

/* GET list of last cars. */
router.get('/', async function(req, res, next) {
  const searchRequest = {
    api_key: KEYS.token,
    category_id: 1,
    bodystyle: [],
    brandOrigin: [],
    model_id: [],
    s_yers: [],
    po_yers: [],
  };

  searchRequest.bodystyle[4] = 2;
  searchRequest.brandOrigin[0] = 276;
  searchRequest.model_id[0] = 0;
  searchRequest.s_yers[0] = 2010;
  searchRequest.po_yers[0] = 2017;

  const response = await request.get(`https://developers.ria.com/auto/search`)
    .query(searchRequest);

  const list = JSON.parse(response.text);

  const last = list.result.search_result.ids[0];

  const getInfoRequest = {
    api_key: KEYS.token,
    auto_id: last,
  };

  const infoResponse = await request.get(`https://developers.ria.com/auto/info`)
    .query(getInfoRequest);

  const { markName, modelName, USD, photoData: { seoLinkB }, autoData: { year } } = JSON.parse(infoResponse.text);

  await bot.sendMessage('476213787', `Car: ${markName} - ${modelName} (${year}) ${USD}. Image: ${seoLinkB}`);
  return res.send({ status: 'ok' })
});

module.exports = router;
