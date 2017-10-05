const {join, extname} = require('path');
const {readFileSync} = require('fs');
const Server = require('@frctl/server');
const mount = require('koa-mount');
const serveStatic = require('koa-static');
const Socket = require('koa-socket');

const skel = readFileSync(join(__dirname, '../views/app.html'), 'utf-8');
const buildDir = join(__dirname, '../dist');

module.exports = async function(app, opts = {}){

  const watcher = app.watch();
  const server = new Server(app, {
    router: {
      prefix: '/_api'
    }
  });

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
    server.app.use(webpackMiddleware);
    await new Promise(resolve => webpackMiddleware.dev.waitUntilValid(resolve));
  } else {
    server.app.use(mount('/_inspector', serveStatic(buildDir)));
  }

  /*
   * Catch-all middleware. Serves the app skeleton to all
   * non-asset requests that have not been otherwise fulfilled.
   */
  server.app.use(ctx => {
    if (!ctx.body && !extname(ctx.request.url)) {
      ctx.body = skel;
    }
  });

  return server;
};
