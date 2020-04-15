const {
  get,
  getAll,
  create,
  update,
  remove,
} = require('../../controllers/wish');
const { Auth, HasAccess } = require('../../middleware/permissions');

const routes = [
  {
    path: '/wishes',
    controller: [
      getAll,
    ],
    method: 'get',
  },
  {
    path: '/wishes/:wishId',
    controller: [
      get,
    ],
    method: 'get',
  },
  {
    path: '/wishes',
    controller: [
      Auth,
      create,
    ],
    method: 'post',
  },
  {
    path: '/wishes/:wishId',
    controller: [
      Auth,
      HasAccess('user', 'wish'),
      update,
    ],
    method: 'patch',
  },
  {
    path: '/wishes/:wishId',
    controller: [
      Auth,
      HasAccess('user', 'wish'),
      remove,
    ],
    method: 'delete',
  },
];

module.exports = routes;
