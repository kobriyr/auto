const chatService = require('./chat');
const riaRequest = require('../utils/ria-request');
const telegram = require('../utils/telegram-bot.js');
const { Brand, Model } = require('../models');

module.exports.checkUpdate = async () => {
  const chats = await chatService.getChats();

  if (chats.length) {
    const listNewAuto = await riaRequest.getAuto();
    console.log('new autos', listNewAuto);
    if (listNewAuto) {
      for (let i = 0; i < listNewAuto.length; i += 1) {
        const { markName, markId, modelId, modelName, USD, photoData: { seoLinkB }, autoData: { year }, linkToView } = await riaRequest.getInfoAboutAuto(listNewAuto[i]);

        const brand = await Brand.findOne({
          name: markName,
          riaId: markId
        });

        if (!brand) {
          await Brand({
            name: markName,
            riaId: markId
          }).save();
        }

        const model = await Model.findOne({
          name: modelName,
          riaId: modelId,
        });

        if (model) {
          model.allowedYears = [...new Set([...model.allowedYears, year])];
          await model.save();
        } else {
          await Model({
            name: modelName,
            riaId: modelId,
            allowedYears: [year]
          }).save();
        }



        const { interQuartileMean } = await riaRequest.getAutoPrice({
          marka_id: markId,
          model_id: modelId,
          yers: year
        });

        if ((interQuartileMean - 1000) > USD) {
          await Promise.all(chats.map(chatId => telegram.sendMsg(chatId, `${markName} ${modelName} (${year}) ${USD}$. (${interQuartileMean.toFixed()}) Image: ${seoLinkB}. https://auto.ria.com${linkToView}`)));
        }
      }
  }
}
};

module.exports.checkDeo = async () => {
  const chats = await chatService.getChats();

  if (chats.length) {
    const listDeo = await riaRequest.getAuto('deo');
    console.log('new deo', listDeo);
    if (listDeo) {
      for (let i = 0; i < listDeo.length; i += 1) {
        const {USD, autoData: { year }, linkToView } = await riaRequest.getInfoAboutAuto(listDeo[i]);

        await Promise.all(chats.map(chatId => telegram.sendMsg(chatId, `DEO (${year}) ${USD}$. https://auto.ria.com${linkToView}`)));
      }
    }
  }
};


module.exports.getAveragePrice = async ({ brand, model, year }) => {
  let interQuartileMean = 0;

  if (brand && model) {
    try {
      const brandDB = await Brand.findById(brand);
      if (brandDB) {
        const modelDB = await Model.findById(model);
        if (model) {
          const { interQuartileMean } = await riaRequest.getAutoPrice({
            marka_id: brandDB.riaId,
            model_id: modelDB.riaId,
            yers: year
          });

          if (interQuartileMean) {
            return interQuartileMean.toFixed();
          }
        }
      }
    } catch (e) {
      console.error('Error:', e.message);
    }
  }

  return interQuartileMean;
};