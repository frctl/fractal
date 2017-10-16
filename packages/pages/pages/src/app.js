const {join} = require('path');
const {forEach} = require('lodash');
const App = require('@frctl/app');
const {EmittingPromise} = require('@frctl/support');
const {permalinkify} = require('@frctl/utils');
const {Fractal} = require('@frctl/fractal');
const debug = require('debug')('frctl:pages');
const {assert} = require('check-types');
const Config = require('./config/store');
const Router = require('./router');
const nunjucksEnv = require('./render/env');
const renderToFiles = require('./utils/render');
const clean = require('./utils/clean');
const write = require('./utils/write');

class Pages extends App {

  constructor(config = {}) {
    assert.string(config.dest, `You must provide a 'dest' value in your pages configuration to specify the output directory [dest-not-found]`);
    super(new Config(config));
    this.debug('instantiated new Pages instance');
  }

  build(fractal, opts = {}) {
    assert.instance(fractal, Fractal, `Pages.build - You must provide a Fractal instance [fractal-invalid]`);

    let filter = () => true;
    if (Array.isArray(opts.pages)) {
      this.debug(`Building pages: ${opts.pages.join(',')}`);
      const permalinks = opts.pages.map(url => permalinkify(url));
      filter = page => permalinks.includes(page.permalink);
    }

    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        const router = new Router();
        const parserOutput = [fractal, this].map(app => app.parse({emitter}));
        const [library, site] = await Promise.all(parserOutput);
        const collections = {library, site};
        const renderOpts = this.get('nunjucks');
        const routeOpts = this.config.get('pages');

        forEach(this.get('routes', {}), (builder, name) => {
          router.addRoute(name, builder, collections, routeOpts);
        });

        const pages = collections.site.pages = router.getPages().clone();

        Object.assign(renderOpts.globals, {
          collections,
          pages,
          components: library.components,
          config: this.config,
          site: this.get('site')
        });

        const env = nunjucksEnv(site.templates, renderOpts);

        Object.assign(env, {
          fractal,
          collections,
          pages: this
        });

        const output = await renderToFiles(pages.filter(filter), env);
        this.debug(`${output.length} files rendered`);

        if (opts.write) {
          const dest = opts.dest || this.get('dest');
          this.debug(`writing pages to ${dest}`);
          await write(dest, output.map(file => {
            file.path = join(dest, file.permalink);
            file.base = dest;
            return file;
          }));
        }

        resolve(output);
      } catch (err) {
        reject(err);
      }
    }, opts.emitter);
  }

  debug(...args) {
    debug(...args);
    return this;
  }

  get version() {
    return Pages.version;
  }

  get [Symbol.toStringTag]() {
    return 'Pages';
  }

}

Pages.version = require('../package.json').version;

module.exports = Pages;
