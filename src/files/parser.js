const parser = require('@frctl/internals/parser');
const config = require('@frctl/fractal-plugin-files-parse-config');
const name = require('./plugins/name');
const role = require('./plugins/role');

module.exports = function (opts = {}) {
  const filesParser = parser();

  filesParser.addPlugin(name(opts.name))
             .addPlugin(role(opts.roles))
             .addPlugin(config(opts.config));

  return filesParser;
};
