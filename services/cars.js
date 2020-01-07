const KEYS = require('../consts/keys');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(KEYS.telegram, {polling: true});
const chatService = require('./chat');
const riaRequest = require('../utils/ria-request');

module.exports.checkUpdate = async () => {
  const chats = await chatService.getChats();

  if (chats.length) {
    console.log('start checking!');
    const listNewAuto = await riaRequest.getAuto();
    console.log('new autos', listNewAuto);
    if (listNewAuto) {
      for (let i = 0; i < listNewAuto.length; i += 1) {
        const { markName, markId, modelId, modelName, USD, photoData: { seoLinkB }, autoData: { year }, linkToView } = await riaRequest.getInfoAboutAuto(listNewAuto[i]);

        const { interQuartileMean } = await riaRequest.getAutoPrice({
          marka_id: markId,
          model_id: modelId,
          yers: year
        });

        if ((interQuartileMean - 1000) > USD) {
          await Promise.all(chats.map(chatId => bot.sendMessage('476213787', `${markName} ${modelName} (${year}) ${USD}$. (${interQuartileMean.toFixed()}) Image: ${seoLinkB}. https://auto.ria.com${linkToView}`)));
        }
      }
    console.log('finish checking!');
  }
}
};

module.exports.checkDeo = async () => {
  const chats = await chatService.getChats();

  if (chats.length) {
    console.log('start checking deo!');
    const listDeo = await riaRequest.getAuto('deo');
    console.log('new deo', listDeo);
    if (listDeo) {
      for (let i = 0; i < listDeo.length; i += 1) {
        const {USD, autoData: { year }, linkToView } = await riaRequest.getInfoAboutAuto(listDeo[i]);

        await Promise.all(chats.map(chatId => bot.sendMessage('476213787', `DEO (${year}) ${USD}$. https://auto.ria.com${linkToView}`)));
      }
      console.log('finish checking deo!');
    }
  }
};