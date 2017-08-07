/* eslint import/no-dynamic-require: off */

const {defaultsDeep} = require('@frctl/utils');
const {NodeJsInputFileSystem, CachedInputFileSystem, ResolverFactory} = require('enhanced-resolve');

const _resolver = new WeakMap();

class Loader {

  constructor(config = {}) {
    const opts = defaultsDeep(config, {
      useSyncFileSystemCalls: true,
      fileSystem: new CachedInputFileSystem(new NodeJsInputFileSystem(), 4000)
    });
    _resolver.set(this, ResolverFactory.createResolver(opts));
  }

  require(path, root) {
    return require(this.resolve(path, root));
  }

  resolve(path, root) {
    try {
      return this.resolver.resolveSync({}, root || process.cwd(), path);
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
