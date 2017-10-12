const {join, extname} = require('path');
const {readFileSync} = require('fs');
const {ApiServer} = require('@frctl/server');
const mount = require('koa-mount');
const serveStatic = require('koa-static');
const Socket = require('koa-socket');
const Router = require('koa-router');

const skel = readFileSync(join(__dirname, '../views/app.html'), 'utf-8');
const distDir = join(__dirname, '../dist');

module.exports = async function (app, opts = {}) {
  const watcher = app.watch();
  const server = new ApiServer(app, {
    api: {
      prefix: '/_api'
    }
  });

  /*
   * Add custom inspector API endpoints
   */
  const router = new Router({
    prefix: '/_api/inspector'
  });

  router.get('/assets/:component', async (ctx, next) => {
    const components = await app.getComponents();
    const component = components.find(ctx.params.component);
    if (!component) {
      ctx.status = 404;
      return;
    }

    let assets = component.get('inspector.assets');
    if (!assets) {
      assets = component.getFiles().filter(f => ['.js', '.css'].includes(f.extname));
    }
    ctx.body = assets.toJSON();
  });

  server.use(router.routes()).use(router.allowedMethods());

  /*
   * Websocket connection for 'change' events
   */
  const socket = new Socket('socket');
  socket.attach(server.app);
  watcher.on('all', (event, path) => socket.broadcast('changed', {event, path}));

  /*
   * If in dev mode use webpack dev middleware
   * and hot module replacement. Otherwise add the
   * dist dir as a static mount point.
   */
  if (opts.dev) {
    const webpackMiddleware = require('koa-webpack')({
      config: require('../webpack.dev'),
      dev: {
        noInfo: true
      }
    });
    server.use(webpackMiddleware);
    await new Promise(resolve => webpackMiddleware.dev.waitUntilValid(resolve));
  } else {
    server.addStatic(distDir, '/_inspector');
  }

  /*
   * Catch-all middleware. Serves the app skeleton to all
   * non-asset requests that have not been otherwise fulfilled.
   */
  server.use(ctx => {
    if (!ctx.body && !extname(ctx.request.url)) {
      ctx.body = skel;
    }
  });

  return server;
};
