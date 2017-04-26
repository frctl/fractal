const _ = require('lodash');
const Fractal = require('./src/fractal');
const defaults = require('./defaults');

module.exports = function (opts = {}, fractal) {
  const config = {};

  _.forEach(defaults, (value, key) => {
    if (!_.isPlainObject(value)) {
      config[key] = opts[key] ? opts[key] : defaults[key];
      return;
    }
    config[key] = Object.assign({}, defaults[key], opts[key] || {});
  });

  fractal = fractal || new Fractal();
  fractal.configure(config);

  return fractal;
};

module.exports.Fractal = Fractal;
