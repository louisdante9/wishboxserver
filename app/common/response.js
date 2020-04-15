const Handler = require('./handler');

module.exports = class Response {
  constructor() {
    this.status = 200;
  }


  static setStatus(status) {
    this.status = status;
    return this;
  }

  static getStatus() {
    return this.status;
  }

  static createMessage(code, type, message, errors = {}) {
    return {
      code,
      type,
      message,
      errors,
    };
  }

  static respond(res, data) {
    return res.status(this.getStatus())
      .json(data);
  }

  static success(res, data) {
    return this.setStatus(200)
      .respond(res, data);
  }

  static notFound(res, type, message) {
    return this.setStatus(404)
      .respond(res, this
        .respond(res, this.createMessage(404, type, message)));
  }

  static serverError(res, type, message, errors) {
    return this.setStatus(500)
      .respond(res, this.createMessage(500, type, message, errors));
  }

  static badRequest(res, type, errors) {
    return this.setStatus(400)
      .respond(res,
        this.createMessage(400, type,
          errors.message,
          Handler.error(errors.errors)));
  }

  static unAuthorize(res, type, message, errors) {
    return this.setStatus(401)
      .respond(res, this
        .respond(res, this.createMessage(500, type, message, errors)));
  }

  static forbidden(res, type, message, errors) {
    return this.setStatus(403)
      .respond(res, this.createMessage(403, type, message, errors));
  }

  static created(res, data) {
    return this.setStatus(201)
      .respond(res, data);
  }
};
