const Loader = require('./src/loader');

module.exports = function (opts) {
  return new Loader(opts);
};

module.exports.Loader = Loader;
