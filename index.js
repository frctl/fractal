const _ = require('lodash');
const utils = require('@frctl/utils');
const Fractal = require('./src/fractal');
const defaults = require('./defaults');

module.exports = function (opts = {}, fractal) {
  const config = utils.defaultsDeep(opts, defaults);

  fractal = fractal || new Fractal();
  fractal.configure(config);

  return fractal;
};

module.exports.Fractal = Fractal;
