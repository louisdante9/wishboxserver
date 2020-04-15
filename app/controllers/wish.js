const Controller = require('.');
const Schema = require('../models/wish');

class Wish extends Controller {
  constructor() {
    super(Schema, 'wish', 'wishId');
  }

  setUpdatable() {
    this.updatable = ['title', 'details', 'status'];
    return this;
  }
}

module.exports = new Wish();
