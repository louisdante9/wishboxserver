module.exports = (model, id) => new Promise((resolve, reject) => {
  model.findOne({ _id: id }, (err, user) => {
    if (user) {
      return resolve(true);
    }

    return reject(new Error(`User with ${id.toString()} does not exits`));
  });
});
