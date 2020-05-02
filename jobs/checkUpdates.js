const cron = require('node-cron');
const carService = require('../src/services/cars');
const userService = require('../src/services/user');

cron.schedule('*/10 * * * * *', async () => {
  await carService.checkUpdate();
  // await carService.checkDeo();
});
