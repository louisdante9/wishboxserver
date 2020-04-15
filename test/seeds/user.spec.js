const { spy, restore } = require('sinon');

require('chai').should();

const Seed = require('../../seed');
const User = require('../../seed/user');
require('../../server');


describe('User seed Implementation ', () => {
  describe('', () => {
    const user = new User();
    const data = user.generate();
    beforeEach(() => user.wipe());

    afterEach(() => restore());

    it('should be an instance of Seed class', () => {
      (user instanceof Seed).should.eql(true);
    });

    it('should be an instance of user class', () => {
      (user instanceof User).should.eql(true);
    });

    it('should implement the generate method', () => {
      user.should.have.property('generate');
    });

    it('should return an object when generate method is called ', () => {
      (typeof data === 'object').should.eql(true);
    });

    it('should return valid object when generate is called', () => {
      data.should.have.property('name');
      data.should.have.property('username');
      data.should.have.property('email');
      data.should.have.property('phone');
      data.should.have.property('profileImage');
      data.should.have.property('street');
    });

    it('should call the generate 5 method when build is called', () => {
      const sinonSpy = spy(user, 'generate');
      user.build(5);
      sinonSpy.callCount.should.eql(5);
    });

    it('should call the generate 5 times if seed is called with limit of 5',
      () => {
        const sinonSpy = spy(user, 'generate');
        user.build(5);
        sinonSpy.callCount.should.eql(5);
      });


    it('should not call wipe if seed is called with reset false', () => {
      const sinonSpy = spy(user, 'generate');
      const wipeSpy = spy(user, 'wipe');
      user.build(5, false);
      sinonSpy.callCount.should.eql(5);
      wipeSpy.callCount.should.eql(0);
    });

    it('should set data to an empty array when wipe is called', () => {
      user.generate();
      user.build(5);
      user.data.length.should.eql(5);
      user.wipe();
      user.data.length.should.eql(0);
    });


    it(`should populate data property with 5 objects when 
      5 is passed into build`,
    () => {
      user.build(5);
      user.data.should.be.an('array');
      user.data.length.should.eql(5);
      user.data.map(object => object.should.be.an('object'));
    });
  });
});
