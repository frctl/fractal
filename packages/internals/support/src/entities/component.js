const {assert} = require('check-types');
const check = require('check-more-types');
const {omit} = require('lodash');
const {cloneDeep, get, set} = require('lodash');
const Collection = require('../collections/collection');
const FileCollection = require('../collections/file-collection');
const Entity = require('./entity');
const File = require('./file');

const _config = new WeakMap();
const _data = new WeakMap();
const _defaults = new WeakMap();

const privateProps = [
  'src', 'files', 'variants', 'config',
  'path', 'relative', 'name'
];

class Component extends Entity {
  constructor(props = {}) {
    assert(check.schema(componentSchema, props), `Component.constructor: The properties provided do not match the schema of a component [properties-invalid]`, TypeError);

    props.name = props.name || props.src.stem;

    super(omit(props, privateProps));

    _data.set(this, {});
    _config.set(this, Object.assign({}, props.config));

    const core = {
      src: props.src,
      files: (props.files || new FileCollection()),
      variants: (props.variants || new Collection()),
      name: props.name || props.src.stem
    };
    Object.defineProperty(core, 'path', {
      enumerable: true,
      get: () => {
        return get(_defaults.get(this), 'src').path;
      }
    });
    Object.defineProperty(core, 'relative', {
      enumerable: true,
      get: () => {
        return get(_defaults.get(this), 'src').relative;
      }
    });
    Object.defineProperty(core, 'config', {
      enumerable: true,
      get: () => {
        return cloneDeep(_config.get(this));
      }
    });

    _defaults.set(this, core);

    return new Proxy(this, {
      get(target, propKey, receiver) {
        if (!Reflect.has(target, propKey)) {
          return target.get(propKey);
        }
        const originalProp = Reflect.get(target, propKey);
        if (typeof originalProp === 'function') {
          return function (...args) {
            let result = originalProp.apply(target, args);
            return result;
          };
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
          Reflect.has(_config.get(target), propKey) ||
          Reflect.has(_defaults.get(target), propKey)
        );
      }
    });
  }

  get(path, fallback) {
    const fallback1 = get(_defaults.get(this), path, fallback);
    const fallback2 = get(_config.get(this), path, fallback1);
    return cloneValue(get(_data.get(this), path, fallback2));
  }

  set(path, value) {
    assert.string(path, 'Component.set - `path` argument must be a string [path-invalid]');
    // TODO: extract shared caching code with config // this.removeFromCache(path);
    if (path in pathChecks) {
      pathChecks[path](value);
    }
    const result = cloneValue(value);
    set(_data.get(this), path, result);
    return result;
  }

  inspect(depth, opts) {
    return ` Component ${JSON.stringify(Object.assign({},
      _defaults.get(this),
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
const isCollection = value => value instanceof Collection;
check.mixin(isCollection, 'collection');
const isFileCollection = value => value instanceof FileCollection;
check.mixin(isFileCollection, 'fileCollection');

const pathChecks = {
  files: value => {
    assert(check.fileCollection(value), `Component.files: The 'files' setter argument must be a FileCollection [files-invalid]`, TypeError);
  },
  variants: value => {
    assert(check.collection(value), `Component.variants: The 'variants' setter argument must be a Collection [variants-invalid]`, TypeError);
  }
};

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
