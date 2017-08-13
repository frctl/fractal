const {ComponentCollection, FileCollection} = require('@frctl/support');
const debug = require('debug')('fractal:core');
const configStore = require('./config');

const _config = new WeakMap();

class Fractal {

  constructor(config = {}) {
    _config.set(this, configStore(config));
    debug('new Fractal instance created');
    debug('using config %O', this.config);
  }

  get(prop, fallback) {
    return _config.get(this).get(prop, fallback);
  }

  parse() {
    // TODO: replace with proper parser implementation
    return Promise.resolve({
      components: new ComponentCollection(),
      files: new FileCollection()
    });
  }

  render(target, opts = {}) {
    return Promise.resolve('');
  }

  getComponents() {
    return this.parse().then(collections => collections.components);
  }

  getFiles() {
    return this.parse().then(collections => collections.files);
  }

  get version() {
    return require('../package.json').version;
  }

  get config() {
    return _config.get(this).data;
  }

}

module.exports = Fractal;
