const fs = require('fs');
const path = require('path');
const request = require('superagent');
const moment = require('moment');
const KEYS = require('../consts/keys');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(KEYS.telegram, {polling: true});
let countRequests = 0;

module.exports.getAuto = async (type) => {
  const searchRequest = getSearchParams(type);
  const response = await sendRequest(`https://developers.ria.com/auto/search`, searchRequest);
  return compareList(response, type);
};

module.exports.getInfoAboutAuto = async (auto_id) => {
  const getInfoRequest = {
    api_key: KEYS.token,
    auto_id,
  };

  return sendRequest(`https://developers.ria.com/auto/info`, getInfoRequest);
};

module.exports.getAutoPrice = async ({ marka_id, model_id, yers }) => {
  const getPriceRequest = {
    api_key: KEYS.token,
    marka_id,
    model_id,
    yers
  };

  return sendRequest(`https://developers.ria.com/auto/average_price`, getPriceRequest);
};

function getSearchParams (type) {
  if (type === 'deo') {
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

    return searchRequest;
  }

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

  return searchRequest;
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

async function sendRequest(url, query) {
  const response = await request.get(url).query(query);
  countRequests += 1;

  if(moment().diff(moment().startOf('hour'), 'seconds') === 0) {
    await bot.sendMessage('476213787', `Report: count of requests per ${moment().format('HH')} - ${countRequests}`);
    countRequests = 0;
  }

  return JSON.parse(response.text);
}