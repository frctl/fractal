/* eslint import/no-dynamic-require: off */

const Module = require('module');
const {defaultsDeep} = require('@frctl/utils');
const {NodeJsInputFileSystem, CachedInputFileSystem, ResolverFactory} = require('enhanced-resolve');

const _resolver = new WeakMap();
const nodeContext = {
  environments: ['node+es3+es5+process+native']
};

class Loader {

  constructor(config = {}) {
    const opts = defaultsDeep(config, {
      useSyncFileSystemCalls: true,
      extensions: ['.js', '.json', '.node'],
      fileSystem: new CachedInputFileSystem(new NodeJsInputFileSystem(), 4000)
    });

    _resolver.set(this, ResolverFactory.createResolver(opts));
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
    try {
      return this.resolver.resolveSync(nodeContext, root || process.cwd(), path);
    } catch (resolverError) {
      try {
        return require.resolve(path);
      } catch (nativeError) {
        throw new Error(`Could not resolve module ${path} [resolver-error]\n${resolverError.message}\n${nativeError.message}`);
      }
    }
  }

  get resolver() {
    return _resolver.get(this);
  }

}

module.exports = Loader;
