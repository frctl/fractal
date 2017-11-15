/* eslint import/no-dynamic-require: off */
const Router = require('koa-router');
const {Fractal} = require('@frctl/fractal');
const Server = require('./server');

const routes = [
  'overview',
  'render',
  'components/list',
  'components/detail'
];

class ApiServer extends Server {

  constructor(fractal, opts = {}) {
    if (!Fractal.isFractal(fractal)) {
      throw new TypeError(`Server.constructor - first argument must be an instance of Fractal [fractal-missing]`);
    }

    super(opts);

    const componentOpts = opts.components || {};
    const router = new Router(opts.api);

    router.use(async (ctx, next) => {
      ctx.fractal = fractal;
      try {
        const {components, files} = await fractal.parse();
        ctx.files = files;
        ctx.components = componentOpts.filter ? components.filter(componentOpts.filter) : components;
      } catch (err) {
        ctx.throw(500, err);
      }
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

    this.use(router.routes()).use(router.allowedMethods());
  }

}

module.exports = ApiServer;
