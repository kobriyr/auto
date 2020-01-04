const request = require('superagent');
const fs = require('fs');
const path = require('path');
const CHAT_ID = '476213787';
const KEYS = require('../consts/keys');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(KEYS.telegram, {polling: true});

module.exports.checkUpdate = async () => {
  const searchRequest = {
    api_key: KEYS.token,
    category_id: 1,
    bodystyle: [],
    s_yers: [],
    po_yers: [],
    price_ot: 1000
  };

  searchRequest.bodystyle[4] = 2;
  searchRequest.s_yers[0] = 2006;
  searchRequest.po_yers[0] = 2010;

  const response = await request.get(`https://developers.ria.com/auto/search`)
    .query(searchRequest);

  const list = JSON.parse(response.text);
  const last = list.result.search_result.ids[0];
  const lastLocal = await fs.readFileSync(path.join(__dirname, '../db/car.txt'), 'utf8');
  if (lastLocal !== last) {
    const getInfoRequest = {
      api_key: KEYS.token,
      auto_id: last,
    };

    const infoResponse = await request.get(`https://developers.ria.com/auto/info`)
      .query(getInfoRequest);

    const { markName, modelName, USD, photoData: { seoLinkB }, autoData: { year } } = JSON.parse(infoResponse.text);

    await bot.sendMessage(CHAT_ID, `Car: ${markName} - ${modelName} (${year}) ${USD}. Image: ${seoLinkB}`);
    await fs.writeFileSync(path.join(__dirname, '../db/car.txt'), last, 'utf8');
  }
};

module.exports.test = async () => {
  await bot.sendMessage(CHAT_ID, 'I am available');
};