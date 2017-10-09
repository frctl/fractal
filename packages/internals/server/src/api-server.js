/* eslint import/no-dynamic-require: off */
const Router = require('koa-router');
const Server = require('./server');

const routes = [
  'overview',
  'components/list',
  'components/detail'
];

class ApiServer extends Server {

  constructor(fractal, opts = {}) {
    super(opts);

    const router = new Router(opts.api);

    router.use(async (ctx, next) => {
      ctx.fractal = fractal;
      return next();
    });

    for (const path of routes) {
      const route = require(`./api/${path}`)();
      router[route.method](route.path, route.handler.bind(router));
    }

    this.app.use(router.routes()).use(router.allowedMethods());
  }

}

module.exports = ApiServer;
