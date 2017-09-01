const debug = require('debug')('frctl:pages');
const Koa = require('koa');
const serve = require('koa-static');
const getPort = require('get-port');
const {normalizePaths, toArray, permalinkify} = require('@frctl/utils');

const _port = new WeakMap();
const _koa = new WeakMap();
const _server = new WeakMap();
const _built = new WeakMap();

class Server {

  constructor(site, opts = {}) {
    const koa = new Koa();

    _koa.set(this, koa);
    _built.set(this, []);

    // TODO: debounce requests?
    // TODO: exclude assets from rebuild?

    koa.use(async (ctx, next) => {
      const built = _built.get(this);
      const path = ctx.request.path;
      const permalink = permalinkify(ctx.request.path);

      if (built.includes(path)) {
        debug('%s - no rebuild required', permalink);
      } else {
        built.push(path);
        debug('%s - rebuilding page on request', permalink);
        await site.build({filter: page => page.permalink === permalink});
      }

      await next();
    });

    koa.use(async (ctx, next) => {
      // TODO: proper error page
      try {
        await next();
      } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = `
          <h1>${err.message}</h1>
          <p>${err.stack}</p>
        `;
      }
    });

    this.addStaticPath(opts.static);
  }

  async start(opts = {}) {
    const port = await getPort(opts);
    return new Promise((resolve, reject) => {
      const httpServer = this.koa.listen(port, err => {
        if (err) {
          return reject(err);
        }
        _port.set(this, port);
        _server.set(this, httpServer);
        resolve(this);
      });
    });
  }

  clearBuildCache() {
    debug('build cache cleared');
    _built.set(this, []);
    return this;
  }

  stop() {
    if (!this.started) {
      throw new Error('Server has not been started');
    }
    _server.get(this).close();
    return this;
  }

  addStaticPath(paths) {
    paths = toArray(paths || []);
    for (const dir of normalizePaths(paths)) {
      debug('added static path %s to server', dir);
      this.koa.use(serve(dir));
    }
    return this;
  }

  get started() {
    return Boolean(_server.get(this));
  }

  get port() {
    if (this.started) {
      return _port.get(this);
    }
    return null;
  }

  get koa() {
    return _koa.get(this);
  }

}

module.exports = Server;
