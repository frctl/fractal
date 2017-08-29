  const {forEach} = require('lodash');
  const App = require('@frctl/app');
  const {EmittingPromise} = require('@frctl/support');
  const {Fractal} = require('@frctl/fractal');
  const debug = require('debug')('frctl:pages');
  const {assert} = require('check-types');
  const Router = require('./router');
  const Config = require('./config/store');

  const _fractal = new WeakMap();

  class Pages extends App {

    constructor(fractal, config = {}) {
      assert.instance(fractal, Fractal, 'Pages.constructor - first argument must be an instance of Fractal [fractal-required]');
      super(new Config(config));
      _fractal.set(this, fractal);
      this.debug('instantiated new Pages instance');
    }

    build(opts = {}) {
      const dest = opts.dest || this.get('dest');
      assert.string(dest, `You must provide a destination path [dest-not-found]`);
      return new EmittingPromise(async (resolve, reject, emitter) => {
        try {
          const pages = await this.getPages({emitter});
          // render pages
          // write to disk
          resolve({dest, pages});
        } catch (err) {
          reject(err);
        }
      }, opts.emitter);
    }

    serve(opts = {}) {

    }

    getPages(opts = {}) {
      return new EmittingPromise(async (resolve, reject, emitter) => {
        const [library, site] = await Promise.all([
          this.fractal.parse({emitter}),
          this.parse({emitter})
        ]);
        try {
          const router = new Router();
          forEach(this.get('routes', {}), builder => {
            router.addRoute(builder, {site, library}, this);
          });
          resolve(router.getPages());
        } catch (err) {
          reject(err);
        }
      }, opts.emitter);
    }

    debug(...args) {
      debug(...args);
      return this;
    }

    get fractal() {
      return _fractal.get(this);
    }

    get version() {
      return require('../package.json').version;
    }

    get [Symbol.toStringTag]() {
      return 'Pages';
    }

}

  module.exports = Pages;
