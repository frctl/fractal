/* eslint import/no-dynamic-require: off */

const {join} = require('path');
const locatePath = require('locate-path');
const debug = require('debug')('frctl:cli');
const {toArray} = require('@frctl/utils');
const {get} = require('lodash');

module.exports = function (pkgPath, opts = {}) {
  let configPath;
  let config = {};

  if (pkgPath) {
    /*
    * package.json found, load it and look for a config file.
    * Custom config file names can be specified using
    * the `fractal.config` property in the package.json
    */

    const pkg = require(pkgPath);
    const pkgConfig = pkg.fractal;
    const fileNames = toArray(get(pkgConfig || {}, 'cli.config', opts.config));
    const filePaths = fileNames.map(p => join(process.cwd(), p.replace(/^\.\//, '')));

    configPath = locatePath.sync(filePaths);

    if (!configPath && pkgConfig) {
      configPath = './package.json';
      config = pkgConfig;
      debug(`no config file found, using config from package.json`);
    } else if (configPath) {
      debug(`config file found: %s`, configPath);
      config = require(configPath);
      debug(`config file read OK`);
    } else {
      debug(`no config file found, looked for %s`, fileNames.join(', '));
    }
  }

  return {configPath, config};
};
