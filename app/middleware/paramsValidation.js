const mongoose = require('mongoose');
const exceptions = require('../common/exceptions');
const asynWrapper = require('./asynWrapper');

module.exports = (model, param) => asynWrapper(async (req, res, next) => {
  const Model = mongoose.model(model);
  const id = req.params[param];

  const resource = await Model.findOne({ _id: id, deleted: false }).lean();

  if (!resource) {
    throw new exceptions.NotFoudException(`${model} with id ${id} not found`);
  }

  req[model.toLowerCase()] = resource;
  next();
});
