const config = require('./config');

module.exports = function (opts = {}) {
  return [
    config(opts.config)
  ];
};
