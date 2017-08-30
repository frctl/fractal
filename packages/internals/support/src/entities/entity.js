const {assert} = require('check-types');
const {isPlainObject, mapValues, pickBy, get, set, unset} = require('lodash');
const {cloneDeep, hash} = require('@frctl/utils');

const _config = new WeakMap();
const _data = new WeakMap();
const _setters = new WeakMap();
const _getters = new WeakMap();

class Entity {

  constructor(props = {}) {
    if (Entity.isEntity(props)) {
      return props;
    }
    this._validateOrThrow(props);

    _data.set(this, {});
    _config.set(this, (props || {}));
    _setters.set(this, []);
    _getters.set(this, []);

    return new Proxy(this, {
      get(target, propKey, receiver) {
        if (!Reflect.has(target, propKey)) {
          return target.get(propKey);
        }
        const originalProp = Reflect.get(target, propKey);
        if (typeof originalProp === 'function') {
          return originalProp.bind(target);
        }
        return originalProp;
      },
      set(target, propKey, value, receiver) {
        if (!Reflect.has(target, propKey)) {
          target.set(propKey, value);
          return true;
        }
        return Reflect.set(target, propKey, value);
      },
      has(target, propKey) {
        return (
          Reflect.has(target, propKey) ||
          Reflect.has(_data.get(target), propKey) ||
          Reflect.has(_config.get(target), propKey)
        );
      }
    });
  }

  get(path, fallback) {
    fallback = get(_config.get(this), path, fallback);
    const initial = cloneDeep(get(_data.get(this), path, fallback));
    return computeFinal(_getters.get(this), path, initial, this);
  }

  set(path, value) {
    assert.string(path, `${this[Symbol.toStringTag]}.set - 'path' argument must be a string [path-invalid]`);
    // TODO: extract shared caching code with config // this.removeFromCache(path);
    const initial = cloneDeep(value);
    const final = computeFinal(_setters.get(this), path, initial, this);
    set(_data.get(this), path, final);
    return final;
  }

  unset(path) {
    assert.string(path, `${this[Symbol.toStringTag]}.set - 'path' argument must be a string [path-invalid]`);
    return unset(_data.get(this), path);
  }

  getConfig() {
    return cloneDeep(_config.get(this));
  }

  getData() {
    return cloneDeep(_data.get(this));
  }

  getComputedProps() {
    return Object.assign({}, _config.get(this), _data.get(this));
  }

  defineGetter(path, getter) {
    _getters.get(this).push({path: path, handler: getter});
  }

  defineSetter(path, setter) {
    _setters.get(this).push({path: path, handler: setter});
  }

  toJSON() {
    let props = this.getComputedProps();
    props = pickBy(props, (item, key) => {
      return !key.startsWith('_');
    });
    return mapValues(props, (item, key) => {
      if (Buffer.isBuffer(item)) {
        return item.toString();
      }
      if (typeof item.toJSON === 'function') {
        return item.toJSON();
      }
      return item;
    });
  }

  clone() {
    function generate(object) {
      const cloned = {};
      Object.keys(object).forEach(key => {
        if (object[key] && typeof object[key].clone === 'function') {
          cloned[key] = object[key].clone();
          return;
        }
        if (isPlainObject(object[key])) {
          cloned[key] = cloneDeep(object[key]);
          return;
        }
        cloned[key] = object[key];
      });
      return cloned;
    }

    const data = generate(_data.get(this));
    const config = generate(_config.get(this));

    const cloned = new this.constructor(config);
    for (let [key, value] of Object.entries(data)) {
      cloned.set(key, value);
    }
    return cloned;
  }

  hash() {
    const merged = this.getComputedProps();

    const hashProps = mapValues(merged, (item, key) => {
      return (typeof item.hash === 'function') ? item.hash() : item;
    });
    return hash(JSON.stringify(hashProps));
  }

  // TODO: Improve formatting: use logging class?
  inspect(depth, opts) {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this.getComputedProps())}`;
  }

  _validateOrThrow(props) {
    assert.maybe.object(props, `Entity.constructor: The properties provided to Entity must be in object form [properties-invalid]`);
  }

  get [Symbol.toStringTag]() {
    return 'Entity';
  }

  static from(props) {
    return new this(props);
  }

  static isEntity(item) {
    return item instanceof Entity;
  }
}

function computeFinal(arr, path, initial, entity) {
  return arr.filter(s => s.path === path)
  .reduce((acc, current) => current.handler(acc, entity), initial);
}

module.exports = Entity;
