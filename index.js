const Fractal = require('./src/fractal');
const defaults = require('./defaults');

module.exports = function (opts = {}, fractal) {
  const config = Object.assign({}, defaults, opts);

  fractal = fractal || new Fractal();
  fractal.configure(config);

  return fractal;
};

module.exports.Fractal = Fractal;
