const {ComponentCollection, FileCollection} = require('@frctl/support');
const {Renderer} = require('@frctl/renderer');
const {Parser} = require('@frctl/parser');
const debug = require('debug')('fractal:core');
const Config = require('./config/store');
const Cache = require('./parser-cache');

const _dirty = new WeakMap();
const _cache = new WeakMap();
const _config = new WeakMap();
const _parser = new WeakMap();
const _renderer = new WeakMap();

class Fractal {

  constructor(configData = {}) {
    debug('instantiating new Fractal instance');

    const config = new Config(configData);
    const cache = new Cache(config.get('cache'));
    const renderer = new Renderer(config.get('adapters'));
    const parser = new Parser(config.pick('src', 'plugins', 'transforms'));

    _dirty.set(this, true);
    _cache.set(this, cache);
    _config.set(this, config);
    _parser.set(this, parser);
    _renderer.set(this, renderer);

    debug('using config %O', config.data);
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

  async render(target, context = {}, opts = {}) {
    opts.collections = opts.collections ? opts.collections : await this.parse();
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

  get parser() {
    return _parser.get(this);
  }

  get isFractal() {
    return true;
  }

  get [Symbol.toStringTag]() {
    return 'Fractal';
  }

}

module.exports = Fractal;
