const cron = require('node-cron');
const carService = require('../src/services/cars');

cron.schedule('*/30 * * * * *', async () => {
  await carService.checkUpdate();
  await carService.checkDeo();
});