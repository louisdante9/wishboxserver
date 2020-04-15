const {
  get,
  getAll,
  create,
  update,
  getRelation,
  remove,
  me,
} = require('../../controllers/user');
const { Auth, HasAccess } = require('../../middleware/permissions');

const routes = [
  {
    path: '/users',
    controller: [
      Auth,
      getAll,
    ],
    method: 'get',
  },
  {
    path: '/me',
    controller: [
      Auth,
      me,
    ],
    method: 'get',
  },
  {
    path: '/users/:userId',
    controller: [
      Auth,
      get,
    ],
    method: 'get',
  },
  {
    path: '/users/:userId/wishes',
    controller: [
      Auth,
      getRelation,
    ],
    method: 'get',
  },
  {
    path: '/users',
    controller: [
      Auth,
      create,
    ],
    method: 'post',
  },
  {
    path: '/users/:userId',
    controller: [
      Auth,
      HasAccess('user', 'user'),
      update,
    ],
    method: 'patch',
  },
  {
    path: '/users/:userId',
    controller: [
      Auth,
      HasAccess('admin', 'user'),
      remove,
    ],
    method: 'delete',
  },
];

module.exports = routes;
