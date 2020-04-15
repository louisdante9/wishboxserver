const mongoose = require('mongoose');
let { should } = require('chai');

const Slot = require('../../app/models/slot');
const SlotSeed = require('../../seed/slot');
require('../../server');

should = should();

describe('slot Model test', () => {
  const slotSeed = new SlotSeed();
  after(() => Slot.collection.deleteMany());

  describe('Create slot', () => {
    it('should save new slot', done => {
      const content = slotSeed.generate();
      const slot = new Slot(content);
      slot.save((err, result) => {
        should.equal(err, null);
        result.should.have.property('_id');
        result.should.have.property('title').eql(content.title);
        result.should.have.property('details').eql(content.details);
        result.should.have.property('open').eql(content.open);
        result.should.have.property('startDate');
        result.should.have.property('endDate');
        done();
      });
    });

    it('should return an error when title is null', done => {
      const content = slotSeed.generate();
      content.title = null;
      const slot = new Slot(content);
      slot.validate(err => {
        err.errors.should.have.property('title');
        err.errors.title.message.should.eql('title is required');
        done();
      });
    });

    it('should return an error when startDate is null', done => {
      const content = slotSeed.generate();
      content.startDate = null;
      const slot = new Slot(content);
      slot.validate(err => {
        err.errors.should.have.property('startDate');
        err.errors.startDate.message.should.eql('start date is required');
        done();
      });
    });


    it('should return an error when endDate is null', done => {
      const content = slotSeed.generate();
      content.endDate = null;
      const slot = new Slot(content);
      slot.validate(err => {
        err.errors.should.have.property('endDate');
        err.errors.endDate.message.should.eql('end date is required');
        done();
      });
    });

    it('should return an error when title already exist', async () => {
      const content = slotSeed.generate();
      await (new Slot(content)).save();

      await (new Slot(content))
        .save()
        .catch(error => {
          error.errors.should.have.property('title');
          error.errors.title.message.should.eql('title already exist');
        });
    });
  });

  describe('Get slot', () => {
    after(() => Slot.collection.deleteMany());

    it('should get a single slot', async () => {
      const content = slotSeed.generate();
      const slot = await (new Slot(content).save());
      const createdSlot = await Slot.get(slot._id);

      createdSlot._id.should.eql(slot._id);
      createdSlot.title.should.eql(slot.title);
    });

    it('should return null if slot does not exist', async () => {
      const content = slotSeed.generate();
      await (new Slot(content).save());
      const createdSlot = await Slot.get(mongoose.Types.ObjectId());

      should.not.exist(createdSlot);
    });
  });

  describe.only('Update slot', () => {
    after(() => Slot.collection.deleteMany());

    it('should update a slot slot', async () => {
      const content = slotSeed.generate();
      const slot = await (new Slot(content).save());
      const createdSlot = await Slot.updateData(
        slot._id,
        { title: 'good man', open: false },
      );

      createdSlot._id.should.eql(slot._id);
      createdSlot.title.should.eql(createdSlot.title);
      createdSlot.open.should.eql(false);
    });

    it('should return null if slot does not exist', async () => {
      const content = slotSeed.generate();
      await (new Slot(content).save());
      const createdSlot = await Slot.updateData(
        mongoose.Types.ObjectId(),
        { title: 'good man', open: false },
      );

      should.not.exist(createdSlot);
    });
  });
});
