const Koa = require('koa');
const serve = require('koa-static');
const getPort = require('get-port');
const {normalizePaths, toArray} = require('@frctl/utils');

const _port = new WeakMap();
const _koa = new WeakMap();
const _server = new WeakMap();

class Server {

  constructor(opts = {}) {
    const koa = new Koa();
    _koa.set(this, koa);
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
        resolve({port});
      });
    });
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

  get koa(){
    return _koa.get(this);
  }

}

module.exports = Server;
