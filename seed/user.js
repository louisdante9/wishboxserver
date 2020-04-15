const faker = require('faker');

const User = require('../app/models/user');
const Seed = require('.');

class UserSeed extends Seed {
  constructor() {
    super(User);
  }

  generate() {
    return {
      name: faker.name.findName().toLowerCase(),
      username: faker.internet.userName().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.phoneNumber(),
      profileImage: faker.image.avatar(),
      street: faker.address.streetAddress(),
      password: 'test1234',
    };
  }
}

module.exports = UserSeed;
