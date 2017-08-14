const {ComponentCollection, FileCollection} = require('@frctl/support');
const {Renderer} = require('@frctl/renderer');
const debug = require('debug')('fractal:core');
const ConfigStore = require('./config-store');
const Cache = require('./parser-cache');

const _config = new WeakMap();
const _renderer = new WeakMap();
const _cache = new WeakMap();
const _dirty = new WeakMap();

class Fractal {

  constructor(config = {}) {
    debug('instantiating new Fractal instance');

    _config.set(this, new ConfigStore(config));
    _cache.set(this, new Cache(this.get('cache')));
    _renderer.set(this, new Renderer(this));
    _dirty.set(this, true);

    debug('using config %O', this.config);
  }

  async parse() {
    const cached = this.cache.get();

    if (cached) {
      return cached;
    }

    // TODO: hook up proper parser
    const collections = await Promise.resolve({
      components: new ComponentCollection(),
      files: new FileCollection()
    });

    this.dirty = false;
    this.cache.set(collections);

    return collections;
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

  get dirty() {
    return _dirty.get(this);
  }

  set dirty(isDirty) {
    _dirty.set(this, isDirty);
    if (isDirty) {
      this.cache.clear();
    }
    return this;
  }

  get version() {
    return require('../package.json').version;
  }

  get cache() {
    return _cache.get(this);
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
