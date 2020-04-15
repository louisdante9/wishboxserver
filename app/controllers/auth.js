const { pick } = require('underscore');

const User = require('../models/user');
const jwt = require('../common/jwt');
const { BadRequestException } = require('../common/exceptions');
const Response = require('../common/response');

class Auth {
  async login(req, res) {
    const { email, password } = req.body;
    const user = await User
      .findOne({ email })
      .select('name email username password');

    if (!user) {
      throw (new BadRequestException('invalid user or password'));
    }

    if (user.validPassword(password)) {
      return res.status(200).json({
        token: jwt.generateToken(user.toJSON()),
      });
    }

    throw (new BadRequestException('invalid user or password'));
  }

  async signup(req, res) {
    const data = pick(
      req.body,
      [
        'name',
        'email',
        'username',
        'password',
        'phone',
        'city',
        'state',
        'street',
      ],
    );

    const instance = new User(data);
    const error = instance.validateSync();

    if (error) {
      return Response.badRequest(res, 'ValidationError', error);
    }

    const user = await instance.save();

    return Response.success(res, user.toJSON());
  }
}

module.exports = new Auth();
