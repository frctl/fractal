const {defaultsDeep} = require('@frctl/utils');
const defaults = require('./config');

module.exports = function (opts = {}) {
  const config = defaultsDeep(opts, defaults);

  return {
    commands: [
      require('./src/commands/inspect')(config)
    ]
  };
};
