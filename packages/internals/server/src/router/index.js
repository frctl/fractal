/* eslint import/no-dynamic-require: off */

const Router = require('koa-router');

const routes = [
  'overview',
  'components/list',
  'components/detail'
];

module.exports = function (fractal, opts = {}) {
  const router = new Router(opts);

  router.use(async (ctx, next) => {
    ctx.fractal = fractal;
    return next();
  });

  for (const path of routes) {
    const route = require(`./${path}`)();
    router[route.method](route.path, route.handler.bind(router));
  }

  return router;
};
