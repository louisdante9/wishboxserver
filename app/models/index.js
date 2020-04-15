const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('debug', true);

module.exports = class Model {
  constructor() {
    this.query = {};
    if (this.buildQuery) {
      throw new Error('BuildQuery method must be implemented');
    }
  }

  static get(id) {
    return this.findOne({ _id: id, deleted: false }).lean();
  }

  static getAll(limit, page, search) {
    limit = parseInt(limit, 10);
    limit = limit || 10;
    page = page || 1;
    const skip = limit * (page - 1);
    const result = { limit, currentPage: page };
    return new Promise((resolve, reject) => {
      this.buildQuery(search)
        .find({ deleted: false, ...this.query })
        .limit(limit)
        .skip(skip)
        .lean()
        .then(data => {
          result.data = data;
          this.find(this.query)
            .countDocuments()
            .then(count => {
              result.count = count;
              resolve(result);
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error));
    });
  }

  static delete(id) {
    return this.findByIdAndRemove(id);
  }

  static updateData(id, details) {
    const options = { new: true };

    return this.findByIdAndUpdate(id, details, options);
  }
};
