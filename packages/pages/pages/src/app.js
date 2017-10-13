// const {forEach} = require('lodash');
const App = require('@frctl/app');
const {EmittingPromise} = require('@frctl/support');
const {permalinkify} = require('@frctl/utils');
const {Fractal} = require('@frctl/fractal');
const debug = require('debug')('frctl:pages');
const {assert} = require('check-types');
const Config = require('./config/store');
// const PageCollection = require('./support/page-collection');

class Pages extends App {

  constructor(config = {}) {
    super(new Config(config));
    this.debug('instantiated new Pages instance');
  }

  build(fractal, opts = {}) {
    const dest = opts.dest || this.get('dest');
    assert.instance(fractal, Fractal, `Pages.build - You must provide a Fractal instance [fractal-invalid]`);
    assert.string(dest, `Pages.build - You must provide a destination path [dest-not-found]`);
    let filter = () => true;
    if (Array.isArray(opts.pages)) {
      const permalinks = opts.pages.map(url => permalinkify(url));
      filter = page => permalinks.includes(page.permalink);
    }

    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        const [library, site] = await Promise.all([
          fractal.parse({emitter}),
          this.parse({emitter})
        ]);
        const collections = {library, site};
        resolve(collections);
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
