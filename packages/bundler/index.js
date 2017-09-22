const Bundler = require('./src/bundler');

module.exports = function (adapters = []) {
  return new Bundler(adapters);
};

module.exports.Bundler = Bundler;
