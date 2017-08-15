const Renderer = require('./src/renderer');

module.exports = function (adapters = []) {
  return new Renderer(adapters);
};

module.exports.Renderer = Renderer;
