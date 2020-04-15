const mongoose = require('mongoose');
const mongoseDelete = require('mongoose-delete');

const Model = require('./');
const helpers = require('./helpers');

mongoose.Promise = global.Promise;

const WishSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      lowercase: true,
      validate: {
        validator(v) {
          return new Promise(resolve => {
            resolve(v && v.length > 2);
          });
        },
        message: 'title should be greater than two characters',
      },
    },
    details: {
      type: String,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user id is required'],
      validate: {
        validator(id) {
          return helpers.FKChecker(mongoose.model('User'), id);
        },
        message: 'user does not exist',
      },
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: [true, 'slot id is required'],
      validate: {
        validator(id) {
          return helpers.FKChecker(mongoose.model('Slot'), id);
        },
        message: 'Slot does not exist',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'open'],
      default: 'open',
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },
);

class Wish extends Model {
  static buildQuery(search) {
    const query = {};
    const {
      title, q, wishId, status, details, deleted, userId, slotId,
    } = search;

    if (q) {
      query.$or = [
        { title: new RegExp(q, 'gmi') },
        { details: new RegExp(q, 'gmi') },
      ];
    }

    if (title) {
      query.title = new RegExp(title, 'gmi');
    }

    if (details) {
      query.details = new RegExp(details, 'gmi');
    }

    if (['pending', 'fulfilled', 'open'].includes(status)) {
      query.status = status;
    }

    if (mongoose.Types.ObjectId.isValid(wishId)) {
      query._id = wishId;
    }

    if (mongoose.Types.ObjectId.isValid(userId)) {
      query.userId = userId;
    }

    if (mongoose.Types.ObjectId.isValid(slotId)) {
      query.slotId = slotId;
    }

    if (deleted) {
      query.deleted = Boolean(deleted === 'true');
    }

    this.query = query;
    return this;
  }
}

WishSchema.loadClass(Wish);
WishSchema.plugin(mongoseDelete);

module.exports = mongoose.model('Wish', WishSchema);
