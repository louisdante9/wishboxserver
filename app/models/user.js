const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoseDelete = require('mongoose-delete');

const Model = require('.');
const helpers = require('./helpers');

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      lowercase: true,
      validate: {
        validator(v) {
          return new Promise(resolve => {
            resolve(v && v.length > 2);
          });
        },
        message: 'name should be greater than two characters',
      },
    },
    username: {
      type: String,
      lowercase: true,
      required: [true, 'username is required'],
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, 'email is required'],
      unique: true,
    },
    profileImage: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, 'phone is required'],
      unique: true,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
      default: 'lagos',
    },
    country: {
      type: String,
      default: 'nigeria',
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      required: true,
      default: 'user',
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

class User extends Model {
  static buildQuery(search) {
    this.query = search
      ? {
        $or: [
          { name: new RegExp(search) },
          { username: new RegExp(search) },
          { email: new RegExp(search) },
        ],
      }
      : {};

    const query = {};
    const {
      name, q, username, email, userId,
    } = search;

    if (q) {
      query.$or = [
        { title: new RegExp(q, 'gmi') },
        { details: new RegExp(q, 'gmi') },
      ];
    }

    [name, username, email].forEach(() => {
      if (name) {
        query[name] = new RegExp(name, 'gmi');
      }
    });

    if (mongoose.Types.ObjectId.isValid(userId)) {
      query._id = userId;
    }

    return this;
  }

  validPassword(password) {
    if (!password || !this.password) {
      return false;
    }

    return bcrypt.compareSync(password, this.password);
  }

  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      username: this.username,
      profileImage: this.profileImage,
      street: this.street,
      city: this.city,
      role: this.role,
    };
  }
}

const uniqueFields = ['username', 'email', 'phone'];

UserSchema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    const duplicateRrror = helpers.GetDuplicateError(error, uniqueFields);
    return next(duplicateRrror);
  }

  if (error) {
    return next(error);
  }

  return next();
});

UserSchema.pre('save', function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 8);
  next();
});

UserSchema.loadClass(User);
UserSchema.plugin(mongoseDelete);

module.exports = mongoose.model('User', UserSchema);
