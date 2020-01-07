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

        const { markName, markId, modelId, modelName, USD, photoData: { seoLinkB }, autoData: { year }, linkToView } = JSON.parse(infoResponse.text);

        const getPriceRequest = {
          api_key: KEYS.token,
          marka_id: markId,
          model_id: modelId,
          yers: year
        };

        const priceResponse = await request.get(`https://developers.ria.com/auto/average_price`)
          .query(getPriceRequest);

        const { interQuartileMean } = JSON.parse(priceResponse.text);

        if ((interQuartileMean - 1000) > USD) {
          await Promise.all(chats.map(chatId => bot.sendMessage(chatId, `${markName} ${modelName} (${year}) ${USD}$. (${interQuartileMean.toFixed()}) Image: ${seoLinkB}. https://auto.ria.com${linkToView}`)));
        }
      }
    console.log('finish checking!');
  }
}
};

module.exports.checkDeo = async () => {
  const chats = await chatService.getChats();

  if (chats.length) {
    console.log('start checking deo!', new Date());
    const listDeo = await getDeo();
    console.log('new deo', listDeo);
    if (listDeo) {
      for (let i = 0; i < listDeo.length; i += 1) {
        const getInfoRequest = {
          api_key: KEYS.token,
          auto_id: listDeo[i],
        };

        const infoResponse = await request.get(`https://developers.ria.com/auto/info`)
          .query(getInfoRequest);

        const {USD, autoData: { year }, linkToView } = JSON.parse(infoResponse.text);

        await Promise.all(chats.map(chatId => bot.sendMessage(chatId, `DEO (${year}) ${USD}$. https://auto.ria.com${linkToView}`)));
      }
      console.log('finish checking deo!');
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

async function getDeo () {
  const searchRequest = {
    noCache: 1,
    api_key: KEYS.token,
    category_id: 1,
    s_yers: [],
    marka_id: [],
    model_id: [],
    price_do:2500,
    currency: 1,
    order_by: 7,
    custom: 3,
  };

  searchRequest.s_yers[0] = 2007;
  searchRequest.marka_id[0] = 18;
  searchRequest.model_id[0] = 161;

  const response = await request.get(`https://developers.ria.com/auto/search`)
    .query(searchRequest);

  return compareList(JSON.parse(response.text), 'deo');
}

async function compareList(list, type = 'car') {
  const response = [];
  const lastLocal = await fs.readFileSync(path.join(__dirname, `../db/${type}.txt`), 'utf8');

  if (lastLocal) {
    const index = list.result.search_result.ids.indexOf(lastLocal);

    for (let i = 0; i < index; i += 1) {
      response.push(list.result.search_result.ids[i]);
    }

    if (index) {
      await fs.writeFileSync(path.join(__dirname, `../db/${type}.txt`), list.result.search_result.ids[0], 'utf8');
    }

    return response;
  }

  await fs.writeFileSync(path.join(__dirname, `../db/${type}.txt`), list.result.search_result.ids[0], 'utf8');
  return list.result.search_result.ids;
};