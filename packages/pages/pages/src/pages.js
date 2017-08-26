const App = require('@frctl/app');
const debug = require('debug')('frctl:pages');
const Config = require('./config/store');

const _fractal = new WeakMap();

class Pages extends App {

  constructor(fractal, config = {}) {
    super(new Config(config));
    _fractal.set(this, fractal);
    this.debug('instantiated new Pages instance');
  }

  build() {

  }

  serve() {

  }

  render() {

  }

  getPages() {
    return this.parse().then(collections => collections.pages);
  }

  getFiles() {
    return this.parse().then(collections => collections.files);
  }

  debug(...args) {
    debug(...args);
    return this;
  }

  get fractal(){
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
