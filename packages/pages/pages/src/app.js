const {forEach} = require('lodash');
const App = require('@frctl/app');
const {EmittingPromise} = require('@frctl/support');
const {Fractal} = require('@frctl/fractal');
const debug = require('debug')('frctl:pages');
const {assert} = require('check-types');
const Config = require('./config/store');
const PageCollection = require('./support/page-collection');

const _fractal = new WeakMap();

class Pages extends App {

  constructor(fractal, config = {}) {
    assert.instance(fractal, Fractal, 'Pages.constructor - first argument must be an instance of Fractal [fractal-required]');
    super(new Config(config));
    _fractal.set(this, fractal);
    this.debug('instantiated new Pages instance');
  }

  getPages(opts = {}) {
    return new EmittingPromise(async (resolve, reject, emitter) => {
      resolve(new PageCollection());
    }, opts.emitter);
  }

  build(opts = {}){
    return new EmittingPromise(async (resolve, reject, emitter) => {
      resolve('done!');
    }, opts.emitter);
  }

  watch() {
    this.fractal.watch().on('all', () => {
      this.dirty = true;
    });
    return super.watch();
  }

  unwatch() {
    this.fractal.unwatch();
    return super.unwatch();
  }

  debug(...args) {
    debug(...args);
    return this;
  }

  get fractal() {
    return _fractal.get(this);
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
