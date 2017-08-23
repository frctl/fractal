const {assert} = require('check-types');
const check = require('check-more-types');
const {omit} = require('lodash');
const {cloneDeep, get, set} = require('lodash');
const {normalizeName} = require('@frctl/utils');
const Collection = require('../collections/collection');
const FileCollection = require('../collections/file-collection');
const Entity = require('./entity');
const File = require('./file');

const _config = new WeakMap();
const _data = new WeakMap();
const _src = new WeakMap();
const _files = new WeakMap();
const _variants = new WeakMap();

class Component extends Entity {
  constructor(props = {}) {
    assert(check.schema(componentSchema, props), `Component.constructor: The properties provided do not match the schema of a component [properties-invalid]`, TypeError);

    super();

    const config = {
      name: normalizeName(props.src.stem),
    };

    _data.set(this, {});
    _config.set(this, Object.assign(config, cloneDeep(props.config || {})));
    _src.set(this, props.src);
    _files.set(this, props.files || new FileCollection());
    _variants.set(this, new Collection());

    for (const variant of config.variants || []) {
      this.addVariant(variant);
    }

    return new Proxy(this, {
      get(target, propKey, receiver) {
        if (!Reflect.has(target, propKey)) {
          return target.get(propKey);
        }
        const originalProp = Reflect.get(target, propKey);
        if (typeof originalProp === 'function') {
          return (...args) => originalProp.apply(target, args);
        }
        return originalProp;
      },
      set(target, propKey, value, receiver) {
        if (!Reflect.has(target, propKey)) {
          return target.set(propKey, value);
        }
        return Reflect.set(target, propKey, value, receiver);
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
    return cloneValue(get(_data.get(this), path, fallback));
  }

  set(path, value) {
    assert.string(path, 'Component.set - `path` argument must be a string [path-invalid]');
    // TODO: extract shared caching code with config // this.removeFromCache(path);
    const result = cloneValue(value);
    set(_data.get(this), path, result);
    return result;
  }

  defineGetter(path, getter) {
    // TODO
  }

  defineSetter(path, setter) {
    // TODO
  }

  getSrc(){
    return _src.get(this);
  }

  getFiles(){
    return _files.get(this);
  }

  addFile(props){
    // TODO
  }

  getVariants(){
    return _variants.get(this);
  }

  addVariant(props){
    // TODO
  }

  inspect(depth, opts) {
    return ` Component ${JSON.stringify(Object.assign({},
      _config.get(this),
      _data.get(this)))}`;
  }

  get [Symbol.toStringTag]() {
    return 'Component';
  }

  static isComponent(item) {
    return item instanceof Component;
  }

}

// TODO: add to utils or wrap cloneDeep?
function cloneValue(value) {
  if (!value) {
    return value;
  }
  return (typeof value.clone === 'function') ? value.clone() : cloneDeep(value);
}

const isFile = value => value instanceof File;
check.mixin(isFile, 'file');
const isFileCollection = value => value instanceof FileCollection;
check.mixin(isFileCollection, 'fileCollection');

const componentSchema = {
  src: check.file,
  config: check.maybe.object,
  files: check.maybe.fileCollection
};

module.exports = Component;
