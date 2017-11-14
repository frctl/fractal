/* eslint import/no-dynamic-require: off */

const {assert} = require('check-types');
const {toArray, defaultsDeep, cloneDeep} = require('@frctl/utils');
const {Validator} = require('@frctl/support');
const {get, set, remove, isObjectLike, isPlainObject, mapValues, flatten} = require('lodash');

const _data = new WeakMap();
const _accessors = new WeakMap();
const _validator = new WeakMap();
const _cache = new WeakMap();

class Config {

  constructor(data = {}, opts = {}) {
    assert.object(data, 'Config.constructor - data must be an object [config-data-invalid]');
    assert.object(opts, 'Config.constructor - opts must be an object [config-opts-invalid]');

    if (opts.schema) {
      const validator = new Validator({allErrors: true});
      validator.addSchema(opts.schema, 'config');
      _validator.set(this, validator);
    }

    _data.set(this, cloneDeep(data));
    _accessors.set(this, []);
    _cache.set(this, []);

    for (const accessor of opts.accessors || []) {
      this.addAccessor(accessor.path, accessor.handler);
    }

    if (opts.defaults) {
      this.addDefaults(opts.defaults);
    }

    this.validate(this.data);
  }

  get(path, fallback) {
    // lookups are cached so that accessors do
    // not run needlessly over the same data
    const cached = this.getCached(path);
    if (cached) {
      return cached.result;
    }
    assert.string(path, 'Config.get - `path` argument must be a string [path-invalid]');
    let result = this.getData(path);

    if (Array.isArray(result)) {
      result = result.map((value, i) => this.get(`${path}.${i}`));
    } else if (isObjectLike(result) && isPlainObject(result)) {
      result = mapValues(result, (val, prop) => this.get(`${path}.${prop}`));
    } else if (typeof result === 'undefined') {
      result = fallback;
    }

    if (result !== fallback) {
      for (const accessor of this.accessors.filter(acc => acc.path === path)) {
        result = accessor.handler(result, this);
      }
      _cache.get(this).push({path, result});
    }
    return result;
  }

  set(path, value) {
    assert.string(path, 'Config.set - `path` argument must be a string [path-invalid]');
    this.removeFromCache(path);
    set(_data.get(this), path, cloneDeep(value));
    this.validate(_data.get(this));
    return this;
  }

  pick(...paths) {
    const result = {};
    flatten(toArray(paths)).forEach(path => {
      const value = this.get(path);
      set(result, path, value);
    });
    return result;
  }

  push(path, value) {
    const target = this.getRaw(path, []);
    if (!Array.isArray(target)) {
      throw new Error(`Cannot push values onto a non-array config property [push-array-only]`);
    }
    target.push(value);
    return this.set(path, target);
  }

  unshift(path, value) {
    const target = this.getRaw(path, []);
    if (!Array.isArray(target)) {
      throw new Error(`Cannot unsift values onto a non-array config property [unshift-array-only]`);
    }
    target.unshift(value);
    return this.set(path, target);
  }

  addDefaults(data, customizer) {
    assert.object(data, 'Config.extend - `data` arguments must an object [data-invalid]');
    assert.maybe.function(customizer, 'Config.extend - `customizer` must a function if provided [customizer-invalid]');
    const result = defaultsDeep(_data.get(this), data, customizer);
    _data.set(this, result);
    return this;
  }

  getData(path, fallback) {
    const result = get(_data.get(this), path, fallback);
    return isObjectLike(result) ? cloneDeep(result) : result;
  }

  getRaw(path, fallback) {
    return get(_data.get(this), path, fallback);
  }

  validate(data) {
    const validator = _validator.get(this);
    if (!validator) {
      return this;
    }
    if (!validator.validate('config', data)) {
      throw new Error(`Config data validation failed: ${validator.errorsText()} [config-invalid]`);
    }
    return this;
  }

  addAccessor(path, handler) {
    if (Array.isArray(path)) {
      path.forEach(target => this.addAccessor(target, handler));
      return this;
    }
    if (typeof handler === 'string') {
      handler = require(`./accessors/${handler}`);
    }
    assert.string(path, 'Accessor path must be a string [accessor-path-invalid]');
    assert.function(handler, 'Accessor handler must be a function [accessor-handler-invalid]');
    this.accessors.push({path, handler});
    this.removeFromCache(path);
    return this;
  }

  getCached(path) {
    const cache = _cache.get(this);
    return cache.find(item => item.path === path);
  }

  removeFromCache(path) {
    const cache = _cache.get(this);
    return remove(cache, item => path.endsWith(`.${item.path}`) || path === item.path);
  }

  clearCache() {
    _cache.set(this, []);
    return this;
  }

  get data() {
    return cloneDeep(_data.get(this));
  }

  get accessors() {
    return _accessors.get(this);
  }

  static isConfig(config) {
    return config instanceof Config;
  }

}

module.exports = Config;
