const Fractal = require('./src/fractal');

module.exports = function (opts = {}) {
  return new Fractal(opts);
};

module.exports.Fractal = Fractal;
