const { IsValidId, ParamsValidation } = require('../../middleware');

module.exports = (router, params = []) => {
  params.forEach(({ param, model }) => {
    router.param(
      param,
      IsValidId([param]),
    );

    router.param(
      param,
      ParamsValidation(model, param),
    );
  });
};
