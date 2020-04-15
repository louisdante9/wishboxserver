const faker = require('faker');
const winston = require('winston');

const Slot = require('./slot');
const User = require('./user');
const Wish = require('./Wish');
const config = require('../app/config');
const db = require('../app/config/db');


db(config).then(async () => {
  const userSeed = new User();
  const slotSeed = new Slot();
  userSeed.wipe();
  slotSeed.wipe();
  (new Wish()).wipe();

  const userData = await userSeed.seed(50);
  const slotData = await slotSeed.seed(4);
  const userIds = await userData.map(({ _id }) => _id);
  const slotIds = await slotData.map(({ _id }) => _id);
  await Promise.all(
    userIds.map(async id => {
      const wish = new Wish();
      wish.update(
        slotIds[faker.random.number({ min: 0, max: 3 })],
        id,
      );

      return wish.seed(faker.random.number(1, 4), false);
    }),
  );
})
  .then(winston.log)
  .catch(winston.log)
  .finally(process.exit);
