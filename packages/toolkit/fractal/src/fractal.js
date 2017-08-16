const Cache = require('node-cache');
const chokidar = require('chokidar');
const {defaultsDeep} = require('@frctl/utils');
const {Component, Variant, File, ComponentCollection, FileCollection, EmittingPromise} = require('@frctl/support');
const {Renderer} = require('@frctl/renderer');
const {Parser} = require('@frctl/parser');
const debug = require('debug')('fractal:core');
const Config = require('./config/store');

const _dirty = new WeakMap();
const _cache = new WeakMap();
const _config = new WeakMap();
const _parser = new WeakMap();
const _renderer = new WeakMap();
const _watcher = new WeakMap();

class Fractal {

  constructor(configData = {}) {
    debug('instantiating new Fractal instance');

    const config = new Config(configData);
    const renderer = new Renderer(config.get('adapters'));
    const parser = new Parser(config.pick('src', 'plugins', 'transforms'));
    const cache = new Cache({
      stdTTL: config.get('cache.ttl'),
      checkperiod: config.get('cache.check'),
      useClones: true
    });

    _dirty.set(this, true);
    _cache.set(this, cache);
    _config.set(this, config);
    _parser.set(this, parser);
    _renderer.set(this, renderer);

    debug('using config %O', config.data);
  }

  async parse() {
    const cached = this.cache.get('collections');
    if (cached) {
      return cached;
    }

    // TODO: hook up proper parser
    const collections = await Promise.resolve({
      components: new ComponentCollection(),
      files: new FileCollection()
    });

    this.dirty = false;
    this.cache.set('collections', collections);

    return collections;
  }

  async render(target, context = {}, opts = {}) {
    const renderer = this.renderer;

    if (renderer.adapters.length === 0) {
      throw new Error(`Fractal.render - You must register one or more adapters before you can render views [no-adapters]`);
    }

    const adapter = opts.adapter ? renderer.getAdapter(opts.adapter) : renderer.getDefaultAdapter();
    if (!adapter) {
      throw new Error(`Fractal.render - The adapter '${opts.adapter}' could not be found [no-adapters]`);
    }

    if (!(Component.isComponent(target) || Variant.isVariant(target) || File.isFile(target))) {
      throw new Error(`Fractal.render - Only components, variants or views can be rendered [target-invalid]`);
    }

    const collections = opts.collections ? opts.collections : await this.parse();

    return new EmittingPromise(async (resolve, reject, emitter) => {
      try {
        let view;
        if (Component.isComponent(target)) {
          // reduce to a variant
          const variant = target.variants.find(variant => {
            return opts.variant ? variant.name === opts.variant : variant.default;
          });
          if (!variant) {
            throw new Error(`Could not find variant '${opts.variant || 'default'}' for component '${target.name}' [variant-not-found]`);
          }
          target = variant;
        }

        if (Variant.isVariant(target)) {
          // reduce to a view
          const component = collections.components.find(c => c.name === target.component);
          const views = component.files.filter(this.get('components.views.filter'));
          view = views.find(v => adapter.match(v.extname));
          if (!view) {
            throw new Error(`Could not find view for component '${component.name}' (using adapter '${adapter.name}') [view-not-found]`);
          }
          context = defaultsDeep(context, target.context || {});
          target = view;
        }

        resolve(await this.renderer.render(view, context, collections, opts, emitter));
      } catch (err) {
        reject(err);
      }
    });
  }

  async getComponents() {
    return this.parse().then(collections => collections.components);
  }

  async getFiles() {
    return this.parse().then(collections => collections.files);
  }

  watch() {
    let watcher = _watcher.get(this);
    if (watcher) {
      return watcher;
    }

    watcher = chokidar.watch(this.get('src'), {
      ignoreInitial: true,
      cwd: process.cwd()
    }).on('all', () => {
      this.dirty = true;
    });

    _watcher.set(this, watcher);
    return watcher;
  }

  unwatch() {
    const watcher = _watcher.get(this);
    if (watcher) {
      watcher.close();
    }
    _watcher.set(this, null);
    return this;
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
      this.cache.del('collections');
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
