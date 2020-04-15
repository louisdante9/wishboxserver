const { spy, restore } = require('sinon');

require('chai').should();

const Seed = require('../../seed');
const Slot = require('../../seed/slot');
require('../../server');


describe('slot seed Implementation ', () => {
  describe('', () => {
    const slot = new Slot();
    const data = slot.generate();
    beforeEach(() => slot.wipe());

    afterEach(() => restore());

    it('should be an instance of Seed class', () => {
      (slot instanceof Seed).should.eql(true);
    });

    it('should be an instance of slot class', () => {
      (slot instanceof Slot).should.eql(true);
    });

    it('should implement the generate method', () => {
      slot.should.have.property('generate');
    });

    it('should return an object when generate method is called ', () => {
      (typeof data === 'object').should.eql(true);
    });

    it('should return valid object when generate is called', () => {
      data.should.have.property('title');
      data.should.have.property('details');
      data.should.have.property('open');
      data.should.have.property('startDate');
      data.should.have.property('endDate');
    });

    it('should call the generate 5 method when build is called', () => {
      const sinonSpy = spy(slot, 'generate');
      slot.build(5);
      sinonSpy.callCount.should.eql(5);
    });

    it('should call the generate 5 times if seed is called with limit of 5',
      () => {
        const sinonSpy = spy(slot, 'generate');
        slot.build(5);
        sinonSpy.callCount.should.eql(5);
      });


    it('should not call wipe if seed is called with reset false', () => {
      const sinonSpy = spy(slot, 'generate');
      const wipeSpy = spy(slot, 'wipe');
      slot.build(5, false);
      sinonSpy.callCount.should.eql(5);
      wipeSpy.callCount.should.eql(0);
    });

    it('should set data to an empty array when wipe is called', () => {
      slot.generate();
      slot.build(5);
      slot.data.length.should.eql(5);
      slot.wipe();
      slot.data.length.should.eql(0);
    });


    it(`should populate data property with 5 objects when 
      5 is passed into build`,
    () => {
      slot.build(5);
      slot.data.should.be.an('array');
      slot.data.length.should.eql(5);
      slot.data.map(object => object.should.be.an('object'));
    });
  });
});
