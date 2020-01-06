const request = require('superagent');
const fs = require('fs');
const path = require('path');
const KEYS = require('../consts/keys');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(KEYS.telegram, {polling: true});
const chatService = require('./chat');

module.exports.checkUpdate = async () => {
  const chats = await chatService.getChats();

  if (chats.length) {
    console.log('start checking!', new Date());
    const listNewAuto = await getAuto();
    console.log('new autos', listNewAuto);
    if (listNewAuto) {
      for (let i = 0; i < listNewAuto.length; i += 1) {
        const getInfoRequest = {
          api_key: KEYS.token,
          auto_id: listNewAuto[i],
        };

        const infoResponse = await request.get(`https://developers.ria.com/auto/info`)
          .query(getInfoRequest);

        const { markName, modelName, USD, photoData: { seoLinkB }, autoData: { year }, linkToView } = JSON.parse(infoResponse.text);

        await Promise.all(chats.map(chatId => bot.sendMessage(chatId, `${markName} ${modelName} (${year}) ${USD}$. Image: ${seoLinkB}. https://auto.ria.com${linkToView}`)));
    }
    console.log('finish checking!');
  }
}
};

async function getAuto () {
  const searchRequest = {
    noCache: 1,
    api_key: KEYS.token,
    category_id: 1,
    s_yers: [],
    po_yers: [],
    price_ot:4500,
    price_do:10000,
    currency: 1,
    order_by: 7,
    custom: 3,
  };

  searchRequest.s_yers[0] = 2007;
  searchRequest.po_yers[0] = 2013;

  const response = await request.get(`https://developers.ria.com/auto/search`)
    .query(searchRequest);

  return compareList(JSON.parse(response.text));
}

async function compareList(list) {
  const response = [];
  const lastLocal = await fs.readFileSync(path.join(__dirname, '../db/car.txt'), 'utf8');

  if (lastLocal) {
    const index = list.result.search_result.ids.indexOf(lastLocal);

    for (let i = 0; i < index; i += 1) {
      response.push(list.result.search_result.ids[i]);
    }

    if (index) {
      await fs.writeFileSync(path.join(__dirname, '../db/car.txt'), list.result.search_result.ids[0], 'utf8');
    }

    return response;
  }

  await fs.writeFileSync(path.join(__dirname, '../db/car.txt'), list.result.search_result.ids[0], 'utf8');
  return list.result.search_result.ids;
};