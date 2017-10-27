const Pages = require('../src/app');

const defaults = {
  src: './src',
  dest: './dest'
};

module.exports.makePages = function (config = {}) {
  return new Pages(Object.assign({}, defaults, config));
};
