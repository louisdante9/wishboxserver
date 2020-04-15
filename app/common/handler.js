module.exports = class Handler {
  static error(errors) {
    const error = {};
    Object.keys(errors).forEach(key => {
      error[key] = errors[key].message;
    });
    return error;
  }
};
