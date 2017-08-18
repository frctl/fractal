const {ExtendedConfig} = require('@frctl/config');
const {get} = require('lodash');
const defaults = require('./defaults');
const schema = require('./schema');

class ConfigStore extends ExtendedConfig {

  constructor(data) {
    const presets = get(data, 'presets', []);

    if (Array.isArray(presets) && presets.length === 0) {
      data.presets = [
        require('@frctl/fractal-preset-core')
      ];
    }

    const accessors = [{
      path: ['plugins', 'adapters', 'transforms'],
      handler: 'packages-loader'
    }];

    super(data, {schema, defaults, accessors});
  }

}

module.exports = ConfigStore;
