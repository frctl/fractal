const Fractal = require('./src/fractal');

module.exports = function (config = {}) {
  config = config || {};
  const fractal = new Fractal(config);
  for (const adapter of (config.adapters || [])) {
    fractal.addAdapter(adapter);
  }
  return fractal;
};

module.exports.Fractal = Fractal;
