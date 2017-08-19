const importCwd = require('import-cwd');
const debug = require('debug')('frctl:cli');

module.exports = function (name, opts) {
  let pkg;
  if (!name.startsWith('.') && !name.startsWith('/')) {
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
};
