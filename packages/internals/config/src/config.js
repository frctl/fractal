/* eslint import/no-dynamic-require: off */

const {assert} = require('check-types');
const {defaultsDeep} = require('@frctl/utils');
const {Validator} = require('@frctl/support');
const {get, set, remove, cloneDeep, isObjectLike, mapValues} = require('lodash');

const _data = new WeakMap();
const _accessors = new WeakMap();
const _validator = new WeakMap();
const _cache = new WeakMap();
const _customizers = new WeakMap();

class Config {

  constructor(data = {}, opts = {}) {
    assert.object(data, 'Config.constructor - config data must be an object [config-data-invalid]');
    assert.object(opts, 'Config.constructor - config opts must be an object [config-opts-invalid]');

    _data.set(this, cloneDeep(data));
    _accessors.set(this, []);
    _cache.set(this, []);

    _customizers.set(this, {
      defaults: get(opts, 'customizers.defaults')
    });

    if (opts.schema) {
      const validator = new Validator({allErrors: true});
      validator.addSchema(opts.schema, 'config');
      _validator.set(this, validator);
    }

    for (const accessor of opts.accessors || []) {
      this.addAccessor(accessor.path, accessor.handler);
    }

    this.validate(_data.get(this));
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
    } else if (isObjectLike(result)) {
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

  addDefaults(...data) {
    assert.array.of.object(data, 'Config.extend - `data` arguments must be objects [data-invalid]');
    const result = defaultsDeep(_data.get(this), ...data, _customizers.get(this).defaults);
    _data.set(this, result);
    return this;
  }

  getData(path, fallback) {
    const result = get(_data.get(this), path, fallback);
    return isObjectLike(result) ? cloneDeep(result) : result;
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

}

module.exports = Config;
