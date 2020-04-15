const { registerRoutes, validateParams } = require('../helper');

const wish = require('./wish');
const user = require('./user');
const slot = require('./slot');
const auth = require('./auth');

module.exports = express => {
  const router = express.Router();
  const params = [
    { param: 'wishId', model: 'Wish' },
    { param: 'userId', model: 'User' },
    { param: 'slotId', model: 'Slot' },
  ];

  validateParams(router, params);
  registerRoutes(router, slot);
  registerRoutes(router, auth);
  registerRoutes(router, user);
  registerRoutes(router, wish);

  return router;
};
