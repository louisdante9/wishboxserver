const Controller = require('.');
const Schema = require('../models/slot');

class Slot extends Controller {
  constructor() {
    super(Schema, 'slot', 'slotId');
  }

  setUpdatable() {
    this.updatable = ['name', 'startDate', 'endDate', 'open'];
    return this;
  }
}

module.exports = new Slot();
