const Config = require('@frctl/config');
const {omit} = require('lodash');
const schema = require('./schema');

const addOns = ['presets', 'commands', 'plugins', 'extensions', 'adapters'];
const accessors = addOns.map(prop => ({
  path: prop,
  handler: 'packages-loader'
}));

function presetMergeCustomizer(objValue, srcValue, key) {
  if (key === 'presets') {
    return srcValue;
  }
  if (addOns.includes(key)) {
    return [...objValue || [], ...srcValue || []];
  }
}

module.exports = function configFactory(data) {
  const appliedPresets = [];

  function init(config) {
    // recursively lookup and merge in presets
    const presets = config.get('presets', []);
    for (const preset of presets.reverse()) {
      if (!appliedPresets.includes(preset.name)) {
        config.defaults(omit(preset.config, 'presets'), presetMergeCustomizer);
        if (Array.isArray(preset.config.presets)) {
          // the preset itself specifies presets...
          const parent = new Config({presets: preset.config.presets}, {schema, init, accessors});
          config.defaults(parent.data, presetMergeCustomizer);
        }
        appliedPresets.push(preset.name);
      }
    }
  }

  return new Config(data, {schema, init, accessors});
};

module.exports.accessors = accessors;
