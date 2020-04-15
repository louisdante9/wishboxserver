const jwt = require('jsonwebtoken');

const config = require('../config');

module.exports.generateToken = paylaod => {
  const options = {
    algorithm: 'HS256',
    issuer: 'wishbox.com',
    audience: 'wishbox.com',
    expiresIn: '365 days',
  };

  return jwt.sign(paylaod, config.secret, options);
};
