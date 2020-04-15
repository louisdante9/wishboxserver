const jwt = require('jsonwebtoken');

const keys = require('../../config');
const user = require('../../models/user');
const wrap = require('../asynWrapper');
const {
  UnAutthorizedRequestException,
} = require('../../common/exceptions');

const auth = async (req, res, next) => {
  const bearer = req.headers.authorization || '';
  const token = bearer.split(' ')[1];
  const errormessage = 'invalid user token';

  if (!token) {
    throw (new UnAutthorizedRequestException(errormessage));
  }

  return jwt.verify(token, keys.secret, async (err, decoded) => {
    if (err) {
      throw (new UnAutthorizedRequestException(errormessage));
    }

    const authUser = await user.findById(decoded._id);

    if (!authUser) {
      throw (new UnAutthorizedRequestException(errormessage));
    }

    req.user = authUser.toJSON();

    return next();
  });
};

module.exports = wrap(auth);
