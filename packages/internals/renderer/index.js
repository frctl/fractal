const Renderer = require('./src/renderer');

module.exports = function (fractal, opts = {}) {
  return new Renderer(fractal, opts);
};

module.exports.Renderer = Renderer;
