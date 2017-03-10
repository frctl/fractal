const Parser = require('@frctl/internals/parser');
const config = require('@frctl/fractal-plugin-files-parse-config');
const name = require('./plugins/name');
const role = require('./plugins/role');

module.exports = function (fractal, opts = {}) {
  const files = new Parser();

  files.use(name(opts.name))
       .use(role(opts.roles))
       .use(config(opts.config));

  return files;
};
