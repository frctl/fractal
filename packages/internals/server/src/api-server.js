/* eslint import/no-dynamic-require: off */
const Router = require('koa-router');
const {Fractal} = require('@frctl/fractal');
const Server = require('./server');

const routes = [
  'overview',
  'render',
  'components/list',
  'components/detail',
  'components/assets'
];

class ApiServer extends Server {

  constructor(fractal, opts = {}) {
    if (!Fractal.isFractal(fractal)) {
      throw new TypeError(`Server.constructor - first argument must be an instance of Fractal [fractal-missing]`);
    }

    super(opts);

    const router = new Router(opts.api);

    router.use(async (ctx, next) => {
      ctx.fractal = fractal;
      return next();
    });

    for (const path of routes) {
      const route = require(`./api/${path}`)();
      const method = router[route.method].bind(router);
      if (typeof route.middleware === 'function') {
        method(route.path, route.middleware, route.handler.bind(router));
      } else {
        method(route.path, route.handler.bind(router));
      }
    }

    this.app.use(router.routes()).use(router.allowedMethods());
  }

}

module.exports = ApiServer;
