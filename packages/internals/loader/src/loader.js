/* eslint import/no-dynamic-require: off */

const Module = require('module');
const fs = require('fs');
const {extname, dirname, join} = require('path');
const parentModule = require('parent-module');
const {create} = require('enhanced-resolve');
const requireFromString = require('require-from-string');
const {toArray} = require('@frctl/utils');
const debug = require('debug')('frctl:loader');
const SyncFileSystemStack = require('./sync-fs-stack');

const moduleLoad = Module._load;

const _resolve = new WeakMap();
const _fileSystem = new WeakMap();
const _transforms = new WeakMap();

class Loader {

  constructor(opts = {}) {
    const fsStack = toArray(opts.fileSystem || []).concat(fs);
    const fileSystem = new SyncFileSystemStack(fsStack);
    const resolverOpts = Object.assign({}, opts, {fileSystem});
    _transforms.set(this, []);
    _fileSystem.set(this, fileSystem);

    _resolve.set(this, create.sync(resolverOpts));

    this.addTransform(require('./transforms/yaml'));
    this.addTransform(require('./transforms/json'));
  }

  require(path, root) {
    try {
      this.hook();
      const result = require(path);
      this.unhook();
      return result;
    } catch (err) {
      this.unhook();
      throw err;
    }
  }

  requireFromString(contents, path) {
    path = path || join(dirname(parentModule()), `${Date.now}.js`);
    this.hook();
    try {
      let result;
      if (this.hasTransformerForPath(path)) {
        result = this.transform(contents, path);
      } else {
        result = requireFromString(contents, path);
      }
      this.unhook();
      return result;
    } catch (err) {
      this.unhook();
      throw err;
    }
  }

  resolve(path, root) {
    const resolve = _resolve.get(this);
    try {
      return resolve(root || dirname(parentModule()), path);
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

  hook() {
    const loader = this;
    const fs = _fileSystem.get(this);
    Module._load = function (request, parent, ...args) {
      const resolvedPath = loader.resolve(request);
      if (loader.hasTransformerForPath(resolvedPath)) {
        const contents = fs.readFileSync(resolvedPath, 'utf-8');
        return loader.transform(contents, resolvedPath);
      }
      if (fs.stack.length > 1 && fs.stack[0].existsSync(resolvedPath)) {
        return requireFromString(fs.stack[0].readFileSync(resolvedPath, 'utf-8'), resolvedPath);
      }
      return moduleLoad(resolvedPath, parent, ...args);
    };
    return this;
  }

  unhook() {
    Module._load = moduleLoad;
    return this;
  }

  transform(contents, path) {
    const ext = extname(path);
    for (const handler of _transforms.get(this)) {
      if (toArray(handler.match).includes(ext)) {
        const transform = handler.transform.bind(handler);
        return transform(contents, path);
      }
    }
    return contents;
  }

  addTransform(transform) {
    _transforms.get(this).push(transform);
    return this;
  }

  hasTransformerForPath(path) {
    return [].concat(..._transforms.get(this).map(t => toArray(t.match))).includes(extname(path));
  }

  get transforms() {
    return _transforms.get(this).slice(0);
  }
}

module.exports = Loader;
