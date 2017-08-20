const importCwd = require('import-cwd');
const debug = require('debug')('frctl:cli');

module.exports = function (pkgPath, config = {}) {
  let fractal;

  /*
   * Try and load a project-specific Fractal instance and
   * fall back to the CLI dependency version if not found.
   */

  try {
    fractal = importCwd('@frctl/fractal');
  } catch (err) {
    debug(err);
    if (pkgPath) {
      debug(`no local Fractal instance available - using global instead (may result in version mismatch!)`);
       // TODO: detect and warn on version mismatch between app version and package.json dependency version?
    }
    fractal = require('@frctl/fractal');
  }

  return fractal(config);
};
