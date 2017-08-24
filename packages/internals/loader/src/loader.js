/* eslint import/no-dynamic-require: off */

const Module = require('module');
const {create} = require('enhanced-resolve');

const _resolve = new WeakMap();

class Loader {

  constructor(opts = {}) {
    _resolve.set(this, create.sync(opts));
  }

  require(path, root) {
    const loader = this;
    const originalRequire = Module.prototype.require;

    /*
     * Monkey-patch require calls within this config file to allow
     * for resolving paths via the Fractal loader.
     */
    Module.prototype.require = function (path) {
      try {
        return Module._load(path, this, false);
      } catch (err) {
        const resolvedPath = loader.resolve(path, root);
        return Module._load(resolvedPath, this, false);
      }
    };

    const result = require(this.resolve(path, root));

    /*
     * Restore monkey-patched require call after the module has been compiled
     */
    Module.prototype.require = originalRequire;

    return result;
  }

  resolve(path, root) {
    const resolve = _resolve.get(this);
    try {
      return resolve(root || process.cwd(), path);
    } catch (resolverError) {
      try {
        return require.resolve(path);
      } catch (nativeError) {
        throw new Error(`Could not resolve module ${path} [resolver-error]\n${resolverError.message}\n${nativeError.message}`);
      }
    }
  }

}

module.exports = Loader;
