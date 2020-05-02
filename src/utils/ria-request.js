require('dotenv').config();
const fs = require('fs');
const path = require('path');
const request = require('superagent');
const moment = require('moment');
const telegram = require('./telegram-bot.js');
const vars = require('../../const/vars');
let countRequests = 0;

const USER_ID = '8857674';

module.exports.getAuto = async (type) => {
  const searchRequest = getSearchParams(type);
  const response = await sendRequest(`https://developers.ria.com/auto/search`, searchRequest);
  return compareList(response, type);
};

module.exports.getInfoAboutAuto = async (auto_id) => {
  const getInfoRequest = {
    auto_id,
  };

  return sendRequest(`https://developers.ria.com/auto/info`, getInfoRequest);
};

module.exports.getAutoPrice = async ({ marka_id, model_id, yers }) => {
  const getPriceRequest = {
    marka_id,
    model_id,
    yers
  };

  return sendRequest(`https://developers.ria.com/auto/average_price`, getPriceRequest);
};

module.exports.createAdvertisement = async () => {
  const URL = `https://developers.ria.com/auto/used/autos?user_id=${USER_ID}&api_key=${process.env.AUTO_RIA_TOKEN_1}`;
  const data = {
    damage: false,
    custom: false,
    year: 2011,
    price :{
      value:7300,
      currency:{
        id: 1
      }
    },
    categories: {
      main: {
         id: 1
      }
    },
    brand: {
      id: 13
    },
    model: {
      id: 3588
    },
    // modification:"V12 AMG B-turbo",
    body: {
      id: 3
    },
    mileage: 160,
    region:{
      id: 5
    },
    city: {
      id: 306
    },
    // VIN: "JKBVNCB164A662141",
    gearbox: {
      id: 1
    },
    drive: {
      id: 2
    },
    fuel: {
      "id":2,
      /*"consumption": {
         "city":10,
         "route":6,
         "combine":8
      }*/
    },
    "engine":{
          "volume":{
             "liters":2.0
    }
    },
    /*"power":{
          "hp":585,
          "kW":430
    },*/
    /*"color":{
          "id":10,
          "metallic":true
    },*/
    "post":{
      "auctions":true,
      "comments":{
         "allowed":true,
         "check":false
      },
/*      "exchanges":{
        "payment":{
          "id":2
        },
        "type":{
          "id":1
        }
      }*/
    },
    /*"video":{
          "key":"lLEiT9PeHSg"
    },*/
    "description":{
          "ru":"Автомобиль свежо пригнан. Из 2-х литровым дизельным двигуном. Автомобиль пригнан из Франции",
          "uk":"Автомобіль свіжо пригнаний. З 2-ох літровим дизельним двигуном. Автомобіль пригнаний з Франції"
    },
    "doors":4,
    "seats":5,
    /*"country":{
      "import":{
        "id":0
      }
    },*/
    "spareParts": false
  };

  const result = await request.post(URL)
    .set('Accept', 'application/json')
    .set('Content-type', 'application/json')
    .send(data);

  return result.body._id;
};

module.exports.addFotos = async (advertisementId) => {
  const data = {
    main: 'https://cdn1.riastatic.com/photosnew/auto/photo/chevrolet_cruze__321932991f.jpg',
    links: [
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219278/321927884/321927884f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219278/321927885/321927885f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219278/321927886/321927886f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219278/321927887/321927887f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219279/321927910/321927910f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219279/321927911/321927911f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219279/321927912/321927912f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219279/321927913/321927913f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219279/321927937/321927937f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219279/321927938/321927938f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32192/3219279/321927939/321927939f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219329/321932990/321932990f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219329/321932991/321932991f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219329/321932992/321932992f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219329/321932995/321932995f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219330/321933018/321933018f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219330/321933019/321933019f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219330/321933020/321933020f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219330/321933021/321933021f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219330/321933037/321933037f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219330/321933038/321933038f.jpg',
      'https://cdn.riastatic.com/photos/auto/photo/32193/3219330/321933039/321933039f.jpg' ]
  };

  const URL = `https://developers.ria.com/auto/used/autos/${advertisementId}/photos/upload?user_id=${USER_ID}&api_key=${process.env.AUTO_RIA_TOKEN_1}`;
  const response = await request.post(URL)
    .send(data);
  console.log('response', response.text)
  return response;
};


module.exports.getFotos = async (auto_id) => {
  const URL = `https://developers.ria.com/auto/fotos/${auto_id}?api_key=${process.env.AUTO_RIA_TOKEN_1}`;
  const result = await request.get(URL);

  return Object.values(result.body.data[auto_id]).map(({ formats }) => formats[0]);
};


module.exports.deleteAdvertisement = async (advertisement_id) => {
  const URL = `https://developers.ria.com/auto/used/autos/${advertisement_id}?user_id=${USER_ID}&api_key=${process.env.AUTO_RIA_TOKEN_1}&reason_id=6`;
  const result = await request.delete(URL);

  console.log(result.text)
};


function getSearchParams (type) {
  if (type === 'deo') {
    const searchRequest = {
      noCache: 1,
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
    category_id: 1,
    s_yers: [],
    po_yers: [],
    price_ot:5000,
    price_do:8000,
    currency: 1,
    order_by: 7,
    custom: 3,
  };

  searchRequest.s_yers[0] = 2007;

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
  Object.assign(query, { api_key: countRequests < 990 ? process.env.AUTO_RIA_TOKEN_1 : process.env.AUTO_RIA_TOKEN_2 });
  const response = await request.get(url).query(query);
  countRequests += 1;

  if(moment().diff(moment().startOf('hour'), 'seconds') === 0) {
    await telegram.sendMsg(vars.supportTelegtamChat, `Report: count of requests per ${moment().format('HH')} - ${countRequests}`);
    countRequests = 0;
  }

  return JSON.parse(response.text);
}
