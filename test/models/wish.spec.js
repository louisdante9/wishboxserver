let { should } = require('chai');

const Wish = require('../../app/models/wish');
const WishSeed = require('../../seed/wish');
const SlotSeed = require('../../seed/slot');
const UserSeed = require('../../seed/user');
require('../../server');

should = should();

describe('slot Model test', () => {
  let userId;
  let slotId;
  let wishSeed;

  before(async () => {
    userId = (await (new UserSeed()).seed(1))[0]._id;
    slotId = (await (new SlotSeed()).seed(1))[0]._id;
    wishSeed = new WishSeed(slotId, userId);
  });

  after(() => Wish.collection.deleteMany());

  describe('Create slot', () => {
    it('should save new slot', done => {
      const content = wishSeed.generate();
      const wish = new Wish(content);
      wish.save((err, result) => {
        should.equal(err, null);
        result.should.have.property('_id');
        result.should.have.property('title').eql(content.title);
        result.should.have.property('userId').eql(content.userId);
        result.should.have.property('slotId').eql(content.slotId);
        result.should.have.property('status').eql(content.status);
        done();
      });
    });

    it('should return an error when title is less than or equal to 2 characters', done => {
      const content = wishSeed.generate();
      content.title = 'sa';
      const slot = new Wish(content);
      slot.validate(err => {
        err.errors.should.have.property('title');
        err.errors.title.message.should.eql('title should be greater than two characters');
        done();
      });
    });


    it('should return an error when title is null', done => {
      const content = wishSeed.generate();
      content.title = null;
      const slot = new Wish(content);
      slot.validate(err => {
        err.errors.should.have.property('title');
        err.errors.title.message.should.eql('title is required');
        done();
      });
    });

    it('should return an error when userId is null', done => {
      const content = wishSeed.generate();
      content.userId = null;
      const slot = new Wish(content);
      slot.validate(err => {
        err.errors.should.have.property('userId');
        err.errors.userId.message.should.eql('user id is required');
        done();
      });
    });

    it('should return an error when slotId is null', done => {
      const content = wishSeed.generate();
      content.slotId = null;
      const slot = new Wish(content);
      slot.validate(err => {
        err.errors.should.have.property('slotId');
        err.errors.slotId.message.should.eql('slot id is required');
        done();
      });
    });
  });
});
