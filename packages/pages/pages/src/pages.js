const {forEach} = require('lodash');
const App = require('@frctl/app');
const {EmittingPromise} = require('@frctl/support');
const {Fractal} = require('@frctl/fractal');
const debug = require('debug')('frctl:pages');
const {assert} = require('check-types');
const Router = require('./router');
const Server = require('./server');
const Config = require('./config/store');
const write = require('./utils/write');
const render = require('./utils/render');

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
        this.debug('building pages');
        const collections = await this.getCombinedCollections({emitter});
        const pages = await this.getPages({collections, emitter});
        collections.site.pages = pages;
        const globals = {
          collections,
          pages,
          components: collections.library.components,
          config: this.config,
          fractal: this.fractal,
          site: this.get('site')
        };

        const filtered = pages.filter(opts.filter || (() => true));
        const rendered = await render(filtered, globals, this.get('nunjucks'), this.fractal);
        const files = rendered.mapToArray(page => page.toFile({base: dest}));

        await write(dest, files);

        this.debug('pages build complete');

        resolve({dest, pages, files});
      } catch (err) {
        reject(err);
      }
    }, opts.emitter);
  }

  async serve(opts = {}) {
    const dest = opts.dir || this.get('dest');
    assert.string(dest, `You must specify the directory to serve files from [dir-not-found]`);
    opts = Object.assign({}, this.get('serve'), opts);

    this.debug('creating new server instance');

    const server = new Server(this, {
      static: [dest],
      urls: {
        ext: this.get('pages.ext'),
        indexes: this.get('pages.indexes')
      }
    });

    this.fractal.watch().on('all', () => {
      server.clearBuildCache();
      this.fractal.parse();
    });

    this.watch().on('all', () => {
      server.clearBuildCache();
      this.parse();
    });

    await this.build({dest});
    return server.start({port: opts.port});
  }

  getCombinedCollections(opts = {}) {
    this.debug('parsing component library and pages');
    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        const [library, site] = await Promise.all([
          this.fractal.parse({emitter}),
          this.parse({emitter})
        ]);
        resolve({library, site});
      } catch (err) {
        reject(err);
      }
    }, opts.emitter);
  }

  getPages(opts = {}) {
    return new EmittingPromise(async (resolve, reject, emitter) => {
      const collections = opts.collections || await this.getCombinedCollections();
      try {
        const router = new Router();
        forEach(this.get('routes', {}), (builder, name) => {
          router.addRoute(name, builder, collections, this);
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
