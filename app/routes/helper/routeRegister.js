module.exports = (router, routes) => {
  routes.forEach(route => {
    router[route.method](route.path, route.controller);
  });

  return router;
};
