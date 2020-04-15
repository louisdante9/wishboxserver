const faker = require('faker');
const mongoose = require('mongoose');

const Wish = require('../app/models/wish');
const Seed = require('.');

/**
 * @class
 */
class WishSeed extends Seed {
  /**
   * @constructor
   * @param {slotId} slotId id of slot this wish would inserted into
   * @param {userId} userId user creating this slot
   */
  constructor(slotId, userId) {
    super(Wish);
    this.slotId = slotId;
    this.userId = userId;
  }

  /**
   * updates Class params
   * @param {slotId} slotId id of slot this wish would inserted into
   * @param {userId} userId user creating this slot
   * @returns {void}
   */
  update(slotId, userId) {
    this.slotId = slotId;
    this.userId = userId;
  }


  /**
   * generates demo data for collection
   * @return {void}
   */
  generate() {
    return {
      title: faker.name.title().toLowerCase(),
      details: faker.lorem.paragraph(),
      userId: this.userId || mongoose.Types.ObjectId(),
      slotId: this.slotId || mongoose.Types.ObjectId(),
      status: ['pending', 'fulfilled', 'open'][
        faker.random.number({ min: 0, max: 2 })
      ],
    };
  }
}

module.exports = WishSeed;
