const utils = require('@frctl/utils');
const defaults = require('./defaults');

module.exports = function (config) {
  config = utils.defaultsDeep(config, defaults);

  if (!config.components.src) {
    throw new Error(`No component src defined`);
  }

  config.components.src = utils.normalizePaths(config.components.src);

  if (config.docs) {
    if (!config.docs.src || !config.docs.dest) {
      throw new Error(`Docs config must specify both 'src' and 'dest' values.`);
    }
    config.docs.src = utils.normalizePath(config.docs.src);
    config.docs.dest = utils.normalizePath(config.docs.dest);
  }

  return config;
};
