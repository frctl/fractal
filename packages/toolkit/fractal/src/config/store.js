const {ExtendedConfig} = require('@frctl/config');
const {get} = require('lodash');
const defaults = require('./defaults');
const schema = require('./schema');

const addOns = ['commands', 'plugins', 'extensions', 'adapters', 'transforms', 'extensions'];
const accessors = addOns.map(prop => ({
  path: prop,
  handler: 'packages-loader'
}));

class ConfigStore extends ExtendedConfig {

  constructor(data) {
    const presets = get(data, 'extends', []);

    if (Array.isArray(presets) && presets.length === 0) {
      data.extends = [
        require('@frctl/fractal-preset-core')
      ];
    }

    super(data, {schema, defaults, accessors});
  }

}

module.exports = ConfigStore;
module.exports.accessors = accessors;
