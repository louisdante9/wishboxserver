const _ = require('underscore');

const Response = require('../common/response');
const Transformer = require('../common/transformer');
const { AsyncWrapper } = require('../middleware');

module.exports = class Controller {
  constructor(schema, type, param, relation) {
    this.schema = schema;
    this.updatable = [];
    this.type = type;
    this.relation = relation;
    this.param = param;

    this.getAll = AsyncWrapper(this.getAll.bind(this));
    this.get = AsyncWrapper(this.get.bind(this));
    this.create = AsyncWrapper(this.create.bind(this));
    this.update = AsyncWrapper(this.update.bind(this));
    this.getRelation = AsyncWrapper(this.getRelation.bind(this));
    this.remove = AsyncWrapper(this.remove.bind(this));
  }

  setUpdatable(array) {
    this.updatable = array;
    return this;
  }

  async get(req, res) {
    return Response.success(res, req[this.type]);
  }

  async getAll(req, res) {
    const { limit, next, ...q } = req.query;
    const data = await this.schema.getAll(limit, next, q);

    return Response.success(res, Transformer.transform(data));
  }

  async create(req, res) {
    const instance = new this.schema({
      ...req.body,
      userId: req.user._id,
    });

    const error = instance.validateSync();
    if (error) {
      return Response
        .badRequest(res, 'ValidationError', error);
    }

    const data = await instance.save();
    Response.success(res, data);
  }

  async update(req, res) {
    const { [this.param]: id } = req.params;
    const { updatable } = this.setUpdatable();
    const body = _.pick(req.body, updatable);

    const data = await this.schema.updateData(id, body);

    return Response.success(res, data);
  }

  async getRelation(req, res) {
    const { limit, page, ...q } = req.query;
    const relation = { [this.relation]: req.params[this.relation] };

    const data = await this.schema.getAll(limit, page, q, relation);
    return Response.success(res, Transformer.transform(data));
  }

  async remove(req, res) {
    const { [this.param]: id } = req.params;
    const data = await this.schema.delete({ _id: id });

    if (data) {
      return Response.success(res, { message: `${this.type} with id ${id} has been deleted` });
    }

    const message = `${this.type} with id ${id} not found`;
    return Response.notFound(res, 'NotFound', message);
  }
};
