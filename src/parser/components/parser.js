const Parser = require('@frctl/internals/parser');
const config = require('./plugins/config');
const name = require('./plugins/name');
const files = require('./plugins/files');
const label = require('./plugins/label');

module.exports = function (fractal) {
  const components = new Parser([
    config(),
    files(),
    name(),
    label()
  ], fractal);

  return components;
};
