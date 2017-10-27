const importCwd = require('import-cwd');
const debug = require('debug')('frctl:cli');

/*
 * Register extensions.
 *
 * Each key in the config is assumed to be an extension package name or path.
 * All core Fractal extensions can have the `@frctl/` namespace omitted and those
 * are checked for first, falling back to the un-namespaced package name if not found.
 *
 * Any extensions that are located are initialised with relevant config options object.
 */

module.exports = function (config = {}) {
  const extensions = [];

  for (const key of Object.keys(config)) {
    const opts = config[key] === true ? {} : config[key];
    const extension = loadExtension(key, opts);
    if (extension) {
      debug(`loaded extension: '${key}'`);
      extensions.push(extension);
    } else {
      debug(`[!] A configuration key '${key}' was defined but no matching package could be loaded`);
    }
  }

  return extensions;
};

function loadExtension(name, opts) {
  let pkg;
  if (!name.startsWith('.') && !name.startsWith('/') && !name.startsWith('@')) {
    try {
      pkg = importCwd(`@frctl/${name}`);
    } catch (err) {
      debug(`Tried loading '@frctl/${name}' - ${err.message}`);
    }
  }
  if (!pkg) {
    try {
      pkg = importCwd(name);
    } catch (err) {
      debug(`Tried loading '${name}' - ${err.message}`);
    }
  }
  if (pkg) {
    if (typeof pkg !== 'function') {
      throw new Error(`Invalid extension package format when loading '${name}' [package-invalid]`);
    }
    return pkg(opts);
  }
}
