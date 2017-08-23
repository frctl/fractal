const {assert} = require('check-types');
const check = require('check-more-types');
const {omit} = require('lodash');
const {cloneDeep, isObjectLike, get, set} = require('lodash');
const Collection = require('../collections/collection');
const FileCollection = require('../collections/file-collection');
const Entity = require('./entity');
const File = require('./file');

const _src = new WeakMap();
const _files = new WeakMap();
const _variants = new WeakMap();
const _config = new WeakMap();
const _data = new WeakMap();

const privateProps = ['src', 'files', 'variants', 'config'];

class Component extends Entity {
  constructor(props = {}) {
    assert(check.schema(componentSchema, props), `Component.constructor: The properties provided do not match the schema of a component [properties-invalid]`, TypeError);

    props.name = props.name || props.src.stem;

    super(omit(props, privateProps));

    _src.set(this, props.src);
    _config.set(this, (props.config || {}));
    _files.set(this, (props.files || new FileCollection()));
    _variants.set(this, (props.variants || new Collection()));
    _data.set(this, {}); // QUESTION: is this inited with the config data, or empty unless explicitly set with `set`?

    // TODO: Revisit if memory impacted
    Object.defineProperty(this, 'path', {
      enumerable: true,
      get: pathGet
    });

    Object.defineProperty(this, 'relative', {
      enumerable: true,
      get: relativeGet
    });

    Object.defineProperty(this, 'files', {
      enumerable: true,
      get: filesGet,
      set: filesSet
    });

    Object.defineProperty(this, 'variants', {
      enumerable: true,
      get: variantsGet,
      set: variantsSet
    });

    Object.defineProperty(this, 'config', {
      enumerable: true,
      get: configGet,
      set: configSet
    });
  }

  get(path, fallback) {
    fallback = get(this.config, path, fallback);
    const result = get(_data.get(this), path, fallback);
    return isObjectLike(result) ? cloneDeep(result) : result;
  }

  set(path, value) {
    assert.string(path, 'Component.set - `path` argument must be a string [path-invalid]');
    // TODO: extract shared caching code with config: this.removeFromCache(path);
    set(_data.get(this), path, cloneDeep(value));
    return this;
  }

  get [Symbol.toStringTag]() {
    return 'Component';
  }

  static isComponent(item) {
    return item instanceof Component;
  }

}

// Reduce memory load by sharing function references
const pathGet = function () {
  return _src.get(this).path;
};
const relativeGet = function () {
  return _src.get(this).relative;
};
const filesGet = function () {
  return _files.get(this);
};
const filesSet = function (files) {
  assert(check.fileCollection(files), `Component.files: The 'files' setter argument must be a FileCollection [files-invalid]`, TypeError);
  _files.set(this, files);
};
const variantsGet = function () {
  return _variants.get(this);
};
const variantsSet = function (variants) {
  assert(check.collection(variants), `Component.variants: The 'variants' setter argument must be a Collection [variants-invalid]`, TypeError);
  _variants.set(this, variants);
};

const configSet = function (config) {
  _config.set(this, config);
};
const configGet = function () {
  return cloneDeep(_config.get(this));
};


const isFile = value => value instanceof File;
check.mixin(isFile, 'file');
const isCollection = value => value instanceof Collection;
check.mixin(isCollection, 'collection');
const isFileCollection = value => value instanceof FileCollection;
check.mixin(isFileCollection, 'fileCollection');

const componentSchema = {
  path: check.maybe.unemptyString,
  relative: check.maybe.unemptyString,
  src: check.file,
  name: check.maybe.unemptyString,
  config: check.maybe.object,
  variants: check.maybe.collection,
  files: check.maybe.fileCollection
};

module.exports = Component;
