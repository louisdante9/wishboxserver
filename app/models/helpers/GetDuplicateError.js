const mongoose = require('mongoose');

const hasError = (message, field) => (new RegExp(field, 'gmi')).test(message);

const generateMessage = field => {
  const validationErrorMessage = new mongoose.Error.ValidationError(null);
  validationErrorMessage.addError(field, new mongoose.Error.ValidatorError({
    message: `${field} already exist`,
  }));

  return validationErrorMessage;
};

module.exports = (error, fields = []) => {
  const field = fields.find(value => hasError(error.message, value));

  return generateMessage(field);
};
