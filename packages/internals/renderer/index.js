const Renderer = require('./src/renderer');
const adapterSchema = require('./src/adapter.schema');

module.exports = function (fractal, opts = {}) {
  return new Renderer(fractal, opts);
};

module.exports.Renderer = Renderer;
module.exports.schema = {
  adapter: adapterSchema
};
