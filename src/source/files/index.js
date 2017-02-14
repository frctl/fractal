const config = require('@frctl/plugin-files-parse-config');
const name = require('./name');
const role = require('./role');

module.exports = function (opts = {}) {
  return [
    name(opts.name),
    role(opts.roles),
    config(opts.config)
  ];
};
