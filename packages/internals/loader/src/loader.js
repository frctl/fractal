/* eslint import/no-dynamic-require: off */

const Module = require('module');
const {readFileSync} = require('fs');
const {extname, dirname} = require('path');
const parentModule = require('parent-module');
const {create} = require('enhanced-resolve');
const {toArray} = require('@frctl/utils');
const debug = require('debug')('frctl:loader');

const _resolve = new WeakMap();
const _transforms = new WeakMap();

class Loader {

  constructor(opts = {}) {
    _transforms.set(this, []);
    _resolve.set(this, create.sync(opts));

    this.addTransform(require('./transforms/yaml'));
    this.addTransform(require('./transforms/json'));
  }

  require(path, root) {
    const loader = this;
    const originalLoad = Module._load;

    root = root || dirname(parentModule());

    try {
      Module._load = function (request, parent, ...args) {
        const resolvedPath = loader.resolve(request, root);
        const transform = loader.getTransformerForPath(resolvedPath);
        if (transform) {
          const contents = readFileSync(resolvedPath, 'utf-8');
          return transform(contents, resolvedPath);
        }
        return originalLoad(resolvedPath, parent, ...args);
      };

      const result = require(path);
      Module._load = originalLoad;

      return result;
    } catch (err) {
      Module._load = originalLoad;
      throw err;
    }
  }

  resolve(path, root) {
    const resolve = _resolve.get(this);
    try {
      return resolve(root || process.cwd(), path);
    } catch (resolverError) {
      try {
        return require.resolve(path);
      } catch (nativeError) {
        debug('error resolving module. resolver error: %s', resolverError.message);
        debug('error resolving module. native error: %s', nativeError.message);
        throw new Error(`Could not resolve module ${path} [resolver-error]`);
      }
    }
  }

  addTransform(transform) {
    _transforms.get(this).push(transform);
    return this;
  }

  getTransformerForPath(path) {
    const ext = extname(path);
    for (const handler of _transforms.get(this)) {
      if (toArray(handler.match).includes(ext)) {
        return handler.transform.bind(handler);
      }
    }
  }

  get transforms() {
    return _transforms.get(this).slice(0);
  }
}

module.exports = Loader;
