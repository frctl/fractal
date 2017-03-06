const Parser = require('@frctl/internals/parser');
const config = require('./plugins/config');
const name = require('./plugins/name');
const label = require('./plugins/label');

module.exports = function () {
  const components = new Parser();

  components.use(config())
            .use(name())
            .use(label());

  return components;
};
