  const {forEach, cloneDeep} = require('lodash');
  const App = require('@frctl/app');
  const {normalizePath} = require('@frctl/utils');
  const {EmittingPromise} = require('@frctl/support');
  const {Fractal} = require('@frctl/fractal');
  const funjucks = require('@frctl/funjucks');
  const debug = require('debug')('frctl:pages');
  const {assert} = require('check-types');
  const Router = require('./router');
  const Config = require('./config/store');
  const write = require('./utils/write');

  const _fractal = new WeakMap();

  class Pages extends App {

    constructor(fractal, config = {}) {
      assert.instance(fractal, Fractal, 'Pages.constructor - first argument must be an instance of Fractal [fractal-required]');
      super(new Config(config));
      _fractal.set(this, fractal);
      this.debug('instantiated new Pages instance');
    }

    build(opts = {}) {
      let dest = opts.dest || this.get('dest');
      assert.string(dest, `You must provide a destination path [dest-not-found]`);
      dest = normalizePath(dest);

      return new EmittingPromise(async (resolve, reject, emitter) => {
        try {
          const collections = await this.getCombinedCollections({emitter});
          const pages = await this.getPages({collections, emitter});
          const renderOpts = cloneDeep(this.get('nunjucks'));

          renderOpts.globals = Object.assign(renderOpts.globals, {
            collections,
            pages,
            components: collections.library.components,
            config: this.config,
            fractal: this.fractal
          });

          const renderer = funjucks(this.fractal, renderOpts);
          const files = await pages.mapToArrayAsync(async page => {
            const file = page.toFile({base: dest});
            if (page.render) {
              const contents = await renderer.renderString(page.contents.toString(), {page});
              file.contents = Buffer.from(contents);
            }
            return file;
          });

          await write(dest, files);

          resolve({dest, pages});
        } catch (err) {
          reject(err);
        }
      }, opts.emitter);
    }

    serve(opts = {}) {

    }

    getCombinedCollections(opts = {}) {
      return new EmittingPromise(async (resolve, reject, emitter) => {
        try {
          const [library, site] = await Promise.all([
            this.fractal.parse({emitter}),
            this.parse({emitter})
          ]);
          resolve({library, site});
        } catch(err) {
          reject(err);
        }
      }, opts.emitter);
    }

    getPages(opts = {}) {
      return new EmittingPromise(async (resolve, reject, emitter) => {
        const collections = opts.collections || await this.getCombinedCollections();
        try {
          const router = new Router();
          forEach(this.get('routes', {}), builder => {
            router.addRoute(builder, collections, this);
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
