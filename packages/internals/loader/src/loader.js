/* eslint import/no-dynamic-require: off */

const Module = require('module');
const {File} = require('@frctl/support');
const {create} = require('enhanced-resolve');
const hook = require('node-hook');
const debug = require('debug')('frctl:loader');
const JSON5 = require('json5');
const YAML = require('js-yaml');

const _resolve = new WeakMap();
const _hooks = new WeakMap();

class Loader {

  constructor(opts = {}) {
    _hooks.set(this, []);
    _resolve.set(this, create.sync(opts));

    this.registerHook('.json', str => JSON5.parse(str));
    this.registerHook('.yml', str => YAML.safeLoad(str));
  }

  require(path, root) {
    debug('requiring %s via loader', path);
    const loader = this;
    const hooks = _hooks.get(this);
    const originalRequire = Module.prototype.require;

    hooks.forEach(h => hook.hook(h.ext, h.hook));

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
     * Restore monkey-patched require method and unhook handlers
     */
    Module.prototype.require = originalRequire;
    hooks.forEach(h => hook.unhook(h.ext));

    return result;
  }

  loadFile(file) {
    debug('loading file %s via loader', file.relative);
    if (!(file instanceof File)) {
      throw new Error(`Loader.requireFile - file must be a File instance [file-invalid]`);
    }

    try {
      const hooks = _hooks.get(this);
      let contents = file.contents.toString();

      /*
       * Run all matching hooks on the file contents
       */
      hooks.forEach(h => {
        if (h.ext === file.extname) {
          contents = h.hook(contents, file.path);
        }
      });

      if (file.extname === '.js') {
        const originalRequire = Module.prototype.require;
        Module.prototype.require = path => this.require(path, file.dirname);

        /*
         * Create a new Module instance from the file contents and compile.
         */
        const m = new Module(file.basename, module.parent);
        m.filename = file.basename;
        m.paths = Module._nodeModulePaths(file.dirname);
        m._compile(contents, file.basename);

        /*
         * Restore monkey-patched require method after the module has been compiled
         */
        Module.prototype.require = originalRequire;
        contents = m.exports;
      }

      return contents;
    } catch (err) {
      debug('error loading file: %s', err.message);
      throw new Error(`Error loading file '${file.relative}' [file-load-error]`);
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

  registerHook(ext, hook) {
    _hooks.get(this).push({ext, hook});
    return this;
  }
}

module.exports = Loader;
