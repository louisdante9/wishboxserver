const mongoose = require('mongoose');
const exceptions = require('../common/exceptions');

const getErrors = (params, inValidIds) => inValidIds.map(value => ({
  message: `id ${params[value]} is not valid`,
  param: value,
  location: 'params',
}));


module.exports = (ids = ['slotId', 'wishId', 'userId']) => (req, res, next) => {
  const { params } = req;

  const inValidIds = ids.filter(value => !mongoose.Types.ObjectId.isValid(params[value]));

  if (inValidIds.length) {
    throw new exceptions.BadRequestException('Invalid param id', getErrors(params, inValidIds));
  }

  return next();
};
