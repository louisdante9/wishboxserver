const faker = require('faker');

const Slot = require('../app/models/slot');
const Seed = require('.');

/**
 * @class
 */
class SlotSeed extends Seed {
  /**
   * @constructor
   * @param {startDate} startDate is when a slot becomes is open for wishes
   * @param {endDate} endDate object
   */
  constructor(startDate, endDate) {
    super(Slot);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  /**
   * generates demo data for collection
   * @return {void}
   */
  generate() {
    return {
      title: faker.name.findName().toLowerCase(),
      details: faker.lorem.paragraph(),
      open: [true, false][faker.random.number(0, 1)],
      startDate: this.startDate || new Date(),
      endDate: this.endDate || new Date(
        (new Date()).setDate((new Date()).getDay() + 78),
      ),
    };
  }
}

module.exports = SlotSeed;
