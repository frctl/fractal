const {ComponentCollection, FileCollection} = require('@frctl/support');
const renderer = require('@frctl/renderer');
const debug = require('debug')('fractal:core');
const configStore = require('./config');

const _config = new WeakMap();
const _renderer = new WeakMap();

class Fractal {

  constructor(config = {}) {
    debug('instantiating new Fractal instance');

    _config.set(this, configStore(config));
    debug('using config %O', this.config);

    _renderer.set(this, renderer(this));
  }

  async parse() {
    // TODO: replace with proper parser implementation
    return Promise.resolve({
      components: new ComponentCollection(),
      files: new FileCollection()
    });
  }

  async render(target, context, opts) {
    return this.renderer.render(target, context, opts);
  }

  async getComponents() {
    return this.parse().then(collections => collections.components);
  }

  async getFiles() {
    return this.parse().then(collections => collections.files);
  }

  get(prop, fallback) {
    return _config.get(this).get(prop, fallback);
  }

  get version() {
    return require('../package.json').version;
  }

  get config() {
    return _config.get(this).data;
  }

  get renderer() {
    return _renderer.get(this);
  }

  get isFractal() {
    return true;
  }

  get [Symbol.toStringTag]() {
    return 'Fractal';
  }

}

module.exports = Fractal;
