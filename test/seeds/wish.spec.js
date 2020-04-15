const { spy, restore } = require('sinon');
const mongoose = require('mongoose');
const { should } = require('chai');

const Seed = require('../../seed');
const Wish = require('../../seed/wish');
const Slot = require('../../seed/slot');
const User = require('../../seed/user');

require('../../server');

should();

describe('wish seed Implementation ', () => {
  describe('', () => {
    let wish;
    let slotId;
    let userId;
    let data;
    const slot = new Slot();
    const user = new User();

    before(async () => {
      const slotData = (await slot.seed(1))[0];
      const userData = (await user.seed(1))[0];

      slotId = slotData._id;
      userId = userData._id;

      wish = new Wish(slotId, userId);
      data = wish.generate();
    });

    beforeEach(() => wish.wipe());
    afterEach(() => restore());

    it('should be an instance of Seed class', () => {
      (wish instanceof Seed).should.eql(true);
    });

    it('should be an instance of wish class', () => {
      (wish instanceof Wish).should.eql(true);
    });

    it('should implement the generate method', () => {
      wish.should.have.property('generate');
    });

    it('should return an object when enerate method is called ', () => {
      (typeof data === 'object').should.eql(true);
    });

    it('should return valid object when generate is called', () => {
      data.should.have.property('title');
      data.should.have.property('details');
      data.should.have.property('userId').to.eql(userId);
      data.should.have.property('slotId').to.eql(slotId);
      data.should.have.property('status').be.oneOf(['pending', 'fulfilled', 'open']);
    });

    it('should call the generate 5 method when build is called', () => {
      const sinonSpy = spy(wish, 'generate');
      wish.build(5);
      sinonSpy.callCount.should.eql(5);
    });

    it('should call the generate 5 times if seed is called with limit of 5',
      () => {
        const sinonSpy = spy(wish, 'generate');
        wish.build(5);
        sinonSpy.callCount.should.eql(5);
      });


    it('should not call wipe if seed is called with reset false', () => {
      const sinonSpy = spy(wish, 'generate');
      const wipeSpy = spy(wish, 'wipe');
      wish.build(5, false);
      sinonSpy.callCount.should.eql(5);
      wipeSpy.callCount.should.eql(0);
    });

    it('should set data to an empty array when wipe is called', () => {
      wish.generate();
      wish.build(5);
      wish.data.length.should.eql(5);
      wish.wipe();
      wish.data.length.should.eql(0);
    });

    it('should update slot and userid on data when update is called', () => {
      const sId = mongoose.Types.ObjectId();
      const uId = mongoose.Types.ObjectId();
      wish.update(sId, uId);

      wish.slotId.should.eql(sId);
      wish.userId.should.eql(uId);
    });


    it(`should populate data property with 5 objects when 
      5 is passed into build`,
    () => {
      wish.build(5);
      wish.data.should.be.an('array');
      wish.data.length.should.eql(5);
      wish.data.map(object => object.should.be.an('object'));
    });
  });
});
