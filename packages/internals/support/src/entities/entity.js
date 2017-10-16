const {assert} = require('check-types');
const {mapValues, pickBy, get, set, unset} = require('lodash');
const {cloneDeep, hash, uuid} = require('@frctl/utils');
const reservedWords = require('../../reserved-words');

const _data = new WeakMap();
const _setters = new WeakMap();
const _getters = new WeakMap();
const _uuid = new WeakMap();

class Entity {

  constructor(props = {}) {
    if (Entity.isEntity(props)) {
      return props;
    }
    this._validateOrThrow(props);

    _data.set(this, cloneDeep(props));
    _setters.set(this, []);
    _getters.set(this, []);
    _uuid.set(this, uuid());

    const proxy = new Proxy(this, {
      get(target, propKey, receiver) {
        if (!Reflect.has(target, propKey)) {
          return target.get(propKey);
        }
        const originalProp = Reflect.get(target, propKey);
        if ((typeof originalProp === 'function') && (propKey !== 'constructor')) {
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
          Reflect.has(_data.get(target), propKey)
        );
      }
    });

    this._proxy = proxy;

    for (const prop of reservedWords) {
      this.defineSetter(prop, () => {
        throw new Error(`The ${prop} property is a reserved property name and cannot be written to directly [reserved-prop]`);
      });
    }

    return proxy;
  }

  get(path, fallback) {
    const initial = get(_data.get(this), path, fallback);
    return computeFinal(_getters.get(this), path, initial, this);
  }

  set(path, value) {
    assert.string(path, `${this[Symbol.toStringTag]}.set - 'path' argument must be a string [path-invalid]`);
    // TODO: extract shared caching code with config // this.removeFromCache(path);
    const final = computeFinal(_setters.get(this), path, value, this);
    set(_data.get(this), path, final);
    return final;
  }

  unset(path) {
    assert.string(path, `${this[Symbol.toStringTag]}.set - 'path' argument must be a string [path-invalid]`);
    return unset(_data.get(this), path);
  }

  getData() {
    return cloneDeep(_data.get(this));
  }

  getProps() {
    const props = this.getData();
    for (const getter of _getters.get(this)) {
      if (!get(props, getter.path)) {
        set(props, getter.path, this.get(getter.path));
      }
    }
    return props;
  }

  getUUID() {
    return _uuid.get(this);
  }

  defineGetter(path, getter) {
    _getters.get(this).push({path: path, handler: getter});
  }

  defineSetter(path, setter) {
    _setters.get(this).push({path: path, handler: setter});
  }

  toJSON() {
    let props = this.getProps();
    props = pickBy(props, (item, key) => {
      return !key.startsWith('_');
    });
    return mapValues(props, (item, key) => {
      if (Buffer.isBuffer(item)) {
        return item.toString();
      }
      if (item && typeof item.toJSON === 'function') {
        return item.toJSON();
      }
      return item;
    });
  }

  clone() {
    const cloned = new this.constructor(this._data);
    return cloned;
  }

  hash() {
    const merged = this.getData();
    const hashProps = mapValues(merged, (item, key) => {
      return (item && typeof item.hash === 'function') ? item.hash() : item;
    });
    return hash(JSON.stringify(hashProps));
  }

  // TODO: Improve formatting: use logging class?
  inspect(depth, opts) {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this.getData())}`;
  }

  _validateOrThrow(props) {
    assert.maybe.object(props, `Entity.constructor: The properties provided to Entity must be in object form [properties-invalid]`);
  }

  get _data() {
    return cloneDeep(_data.get(this));
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
