const ip = require('ip');
const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const getPort = require('get-port');
const {normalizePath} = require('@frctl/utils');

const _app = new WeakMap();
const _port = new WeakMap();
const _server = new WeakMap();

class Server {

  constructor(opts = {}) {
    _app.set(this, new Koa());
  }

  async start(port) {
    port = await getPort(port);
    return new Promise((resolve, reject) => {
      const httpServer = this.app.listen(port, err => {
        if (err) {
          return reject(err);
        }
        _port.set(this, port);
        _server.set(this, httpServer);
        resolve(httpServer);
      });
    });
  }

  addStatic(path, mountPath = '/'){
    path = normalizePath(path);
    this.use(mount(mountPath, serve(path)));
    return this;
  }

  use(...args) {
    return this.app.use(...args);
  }

  stop() {
    if (!this.started) {
      throw new Error('Server has not been started');
    }
    _server.get(this).close();
    _server.set(this, undefined);
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

  get ip() {
    return `http://${ip.address()}:${this.port}`;
  }

  get app() {
    return _app.get(this);
  }

  get httpServer() {
    return _server.get(this);
  }

}

module.exports = Server;
