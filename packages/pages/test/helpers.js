const {Fractal} = require('@frctl/fractal');
const Pages = require('../src/app');

const defaults = {
  src: './src',
  dest: './dest'
};

module.exports.makePages = function (config = {}) {
  return new Pages(new Fractal(), Object.assign({}, defaults, config));
};
