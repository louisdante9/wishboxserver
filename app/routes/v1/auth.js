const { check } = require('express-validator');

const { login, signup } = require('../../controllers/auth');
const { BadRequestHandler, AsyncWrapper } = require('../../middleware');

const routes = [
  {
    path: '/login',
    controller: [
      check('email').isEmail(),
      check('password').isLength({ min: 5 }),
      BadRequestHandler,
      AsyncWrapper(login),
    ],
    method: 'post',
  },
  {
    path: '/signup',
    controller: [
      check('name').isString(),
      check('username').isString().isLength({ min: 3 }),
      check('email').isEmail(),
      check('password').isLength({ min: 5 }),
      check('street').isLength({ min: 5 }),
      check('city').isLength({ min: 5 }),
      check('state').isLength({ min: 5 }),
      BadRequestHandler,
      AsyncWrapper(signup),
    ],
    method: 'post',
  },
];

module.exports = routes;
