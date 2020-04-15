
const wrap = require('../asynWrapper');
const {
  ForbiddenRequestException,
} = require('../../common/exceptions');

const isAdmin = role => ['admin', 'superadmin'].includes(role);

const IdToString = id => (typeof id === 'string' ? id : id.toString());

const equals = (a, b) => a === b;

const isOwner = (req, role, resource) => {
  const { user, [resource]: payload } = req;
  const admin = isAdmin(user.role);

  if (admin) {
    return true;
  }

  if (user.role !== role) {
    return false;
  }

  const userId = IdToString(user._id);
  const ownerId = IdToString(payload.userId);
  const payloadId = IdToString(payload._id);

  switch (resource) {
  case 'slot':
    return isAdmin(user.role);
  case 'user':
    return equals(userId, payloadId);
  default:
    return equals(ownerId, userId);
  }
};

const hasAccess = (role, resource) => wrap((req, res, next) => {
  if (!isOwner(req, role, resource)) {
    throw (
      new ForbiddenRequestException(
        'you don\'t have access to perform this action',
      )
    );
  }

  next();
});


module.exports = hasAccess;
