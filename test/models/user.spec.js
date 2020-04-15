let { should } = require('chai');

const User = require('../../app/models/user');
const UserSeed = require('../../seed/user');
require('../../server');

should = should();

describe('User Model test', () => {
  const userSeed = new UserSeed();
  after(() => User.collection.deleteMany());
  describe('Create user', () => {
    it('should save new user', done => {
      const content = userSeed.generate();
      const user = new User(content);
      user.save((err, result) => {
        should.equal(err, null);
        result.should.have.property('_id');
        result.should.have.property('name').eql(content.name);
        result.should.have.property('username').eql(content.username);
        result.should.have.property('email').eql(content.email);
        result.should.have.property('phone').eql(content.phone);
        result.should.have.property('profileImage').eql(content.profileImage);
        result.should.have.property('street').eql(content.street);
        done();
      });
    });

    it('should return an error when name is null', done => {
      const content = userSeed.generate();
      content.name = null;
      const user = new User(content);
      user.validate(err => {
        err.errors.should.have.property('name');
        err.errors.name.message.should
          .eql('name is required');
        done();
      });
    });


    it('should return an error when name is less that 3', done => {
      const content = userSeed.generate();
      content.name = 'te';
      const user = new User(content);
      user.validate(err => {
        err.errors.should.have.property('name');
        err.errors.name.message.should
          .eql('name should be greater than two characters');
        done();
      });
    });

    it('should return an error when email is null', done => {
      const content = userSeed.generate();
      content.email = null;
      const user = new User(content);
      user.validate(err => {
        err.errors.should.have.property('email');
        err.errors.email.message.should
          .eql('email is required');
        done();
      });
    });

    it('should return an error when username is null', done => {
      const content = userSeed.generate();
      content.username = null;
      const user = new User(content);
      user.validate(err => {
        err.errors.should.have.property('username');
        err.errors.username.message.should
          .eql('username is required');
        done();
      });
    });

    it('should return an error when phone is null', done => {
      const content = userSeed.generate();
      content.phone = null;
      const user = new User(content);
      user.validate(err => {
        err.errors.should.have.property('phone');
        err.errors.phone.message.should
          .eql('phone is required');
        done();
      });
    });

    it('should return an error when username already exist', async () => {
      const content = userSeed.generate();
      await (new User(content)).save();

      await (new User(content))
        .save()
        .catch(error => {
          error.errors.should.have.property('username');
          error.errors.username.message.should.eql('username already exist');
        });
    });

    it('should return an error when email already exist', async () => {
      const content = userSeed.generate();
      await (new User(content)).save();


      await (new User({ ...userSeed.generate(), email: content.email }))
        .save()
        .catch(error => {
          error.errors.should.have.property('email');
          error.errors.email.message.should.eql('email already exist');
        });
    });

    it('should return an error when phone already exist', async () => {
      const content = userSeed.generate();
      await (new User(content)).save();


      await (new User({ ...userSeed.generate(), phone: content.phone }))
        .save()
        .catch(error => {
          error.errors.should.have.property('phone');
          error.errors.phone.message.should.eql('phone already exist');
        });
    });
  });
});
