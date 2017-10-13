const Pages = require('../src/app');

module.exports.makePages = function (config) {
  return new Pages(config);
};
