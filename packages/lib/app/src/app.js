const {dirname} = require('path');
const Cache = require('node-cache');
const chokidar = require('chokidar');
const parentModule = require('parent-module');
const debug = require('debug')('frctl:app');
const {Config} = require('@frctl/config');
const {Parser} = require('@frctl/parser');
const {Loader} = require('@frctl/loader');
const {EmittingPromise, FileCollection} = require('@frctl/support');

const _dirty = new WeakMap();
const _cache = new WeakMap();
const _config = new WeakMap();
const _parsing = new WeakMap();
const _watcher = new WeakMap();

class App {

  constructor(config = {}) {
    if (!Config.isConfig(config)) {
      config = new Config(config, {
        defaults: {
          plugins: [],
          transforms: []
        }
      });
    }

    _config.set(this, config);
    _cache.set(this, new Cache({
      stdTTL: this.get('cache.ttl'),
      checkperiod: this.get('cache.check'),
      useClones: false
    }));

    _dirty.set(this, true);
  }

  parse(opts = {}) {
    if (_parsing.get(this)) {
      return _parsing.get(this);
    }

    const result = new EmittingPromise(async (resolve, reject, emitter) => {
      emitter.emit('parse.start');
      const cached = this.cache.get('collections');
      if (cached) {
        return resolve(Object.assign({}, cached));
      }
      try {
        const parser = this.getParser();
        const collections = await parser.run({context: this}, emitter);
        this.dirty = false;
        this.cache.set('collections', collections);
        resolve(collections);
      } catch (err) {
        this.dirty = true;
        reject(err);
      }
    }, opts.emitter);

    _parsing.set(this, result);

    return result.then(collections => {
      _parsing.set(this, null);
      return collections;
    }).catch(err => {
      _parsing.set(this, null);
      throw err;
    });
  }

  watch() {
    let watcher = _watcher.get(this);
    if (watcher) {
      return watcher;
    }

    this.debug(`starting watch task`);

    watcher = chokidar.watch(this.get('src'), {
      ignoreInitial: true,
      cwd: process.cwd()
    }).on('all', () => {
      this.debug(`source change detected`);
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
    this.debug(`stopping watch task`);
    _watcher.set(this, null);
    return this;
  }

  get(prop, fallback) {
    return _config.get(this).get(prop, fallback);
  }

  set(prop, value) {
    this.debug(`setting config value %s = %s`, prop, value);
    this.dirty = true;
    _config.get(this).set(prop, value);
    return this;
  }

  addPlugin(plugin) {
    this.debug(`adding plugin %s`, plugin);
    this.dirty = true;
    this.config.push('plugins', plugin);
    return this;
  }

  addTransform(transform) {
    this.debug(`adding transform %s`, transform);
    this.dirty = true;
    this.config.push('transforms', transform);
    return this;
  }

  getCollections() {
    return this.parse();
  }

  getFiles() {
    return this.parse().then(collections => collections.files);
  }

  getParser() {
    return new Parser({
      src: this.get('src'),
      plugins: this.get('plugins', []),
      transforms: this.get('transforms', [])
    });
  }

  getLoader(fileSystem) {
    if (FileCollection.isCollection(fileSystem)) {
      fileSystem = fileSystem.toMemoryFS();
    }
    const opts = Object.assign({}, this.get('resolve'), {fileSystem});
    return new Loader(opts);
  }

  async require(path, startPath) {
    startPath = startPath || dirname(parentModule());
    const files = await this.getFiles();
    return this.getLoader(files).require(path, startPath);
  }

  async requireFromString(contents, path) {
    const files = await this.getFiles();
    return this.getLoader(files).requireFromString(contents, path);
  }

  debug(...args) {
    debug(...args);
    return this;
  }

  get dirty() {
    return _dirty.get(this);
  }

  set dirty(isDirty) {
    this.debug(`setting dirty flag to '%s'`, isDirty ? 'true' : 'false');
    _dirty.set(this, isDirty);
    if (isDirty) {
      this.cache.del('collections');
    }
    return this;
  }

  get cache() {
    return _cache.get(this);
  }

  get config() {
    return _config.get(this);
  }

}

module.exports = App;
