const {ExtendedConfig} = require('@frctl/config');
const {get} = require('lodash');
const defaults = require('./defaults');
const schema = require('./schema');

const addOns = ['commands', 'plugins', 'extensions', 'adapters', 'transforms'];
const accessors = addOns.map(prop => ({
  path: prop,
  handler: 'packages-loader'
}));

function defaultsCustomizer(targetValue, defaultValue, key) {
  if (addOns.includes(key)) {
    targetValue = typeof targetValue === 'undefined' ? [] : targetValue;
    defaultValue = typeof defaultValue === 'undefined' ? [] : defaultValue;
    if (Array.isArray(targetValue) && Array.isArray(defaultValue)) {
      return [...defaultValue, ...targetValue];
    }
  }
}

class ConfigStore extends ExtendedConfig {

  constructor(data) {
    const presets = get(data, 'extends', []);

    if (Array.isArray(presets) && presets.length === 0) {
      data.extends = [
        require('@frctl/fractal-preset-core')
      ];
    }

    super(data, {
      schema,
      defaults,
      accessors,
      customizers: {
        defaults: defaultsCustomizer
      }
    });
  }

}

module.exports = ConfigStore;
module.exports.accessors = accessors;
module.exports.defaultsCustomizer = defaultsCustomizer;
