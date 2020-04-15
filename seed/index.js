const winston = require('winston');


module.exports = class Seed {
  constructor(schema) {
    this.data = [];
    this.schema = schema;
    if (this.generate === undefined) {
      throw new TypeError('Abstract class implements generate method');
    }
  }

  wipe() {
    this.data = [];
    this.schema.collection.deleteMany();
    return this;
  }

  build(number = 1) {
    for (let i = 0; i < number; i += 1) {
      this.data.push(i);
    }
    this.data = this.data.map(() => this.generate());
    return this;
  }

  seed(limit = 1, reset = true) {
    if (reset) {
      this.wipe();
    }

    const seedPromises = this
      .build(limit)
      .data.map(data => (new this.schema(data).save()));

    return Promise.all(seedPromises);
  }

  run() {
    if (['development', 'test'].includes(process.env.NODE_ENV)) {
      this.schema.insertMany(this.data)
        .then(() => {
          winston.log('info', 'seeding was successful');
          return true;
        })
        .catch(err => {
          throw new Error(err.message);
        });
    } else {
      process.exit(0);
    }
  }
};
