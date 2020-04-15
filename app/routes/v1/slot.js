const {
  get,
  getAll,
  create,
  update,
  remove,
} = require('../../controllers/slot');
const { Auth, HasAccess } = require('../../middleware/permissions');

const routes = [
  {
    path: '/slots',
    controller: [
      getAll,
    ],
    method: 'get',
  },
  {
    path: '/slots/:slotId',
    controller: [
      get,
    ],
    method: 'get',
  },
  {
    path: '/slots',
    controller: [
      Auth,
      HasAccess('admin', 'slot'),
      create,
    ],
    method: 'post',
  },
  {
    path: '/slots/:slotId',
    controller: [
      Auth,
      HasAccess('admin', 'slot'),
      update,
    ],
    method: 'patch',
  },
  {
    path: '/slots/:slotId',
    controller: [
      Auth,
      HasAccess('admin', 'slot'),
      remove,
    ],
    method: 'delete',
  },
];

module.exports = routes;
