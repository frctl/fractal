const {toArray} = require('@frctl/utils');
const loadPkgs = require('./packages-loader');

module.exports = function presetsResolver(target) {
  let resolved = [];

  function resolvePresets(preset) {
    const presets = loadPkgs(toArray(preset));
    for (const preset of presets) {
      if (resolved.find(config => config.name === preset.name)) {
        continue; // already been applied, skip
      }
      if (preset.config && Array.isArray(preset.config.presets)) {
        // the preset itself specifies presets to extend from
        resolvePresets(preset.config.presets);
      }
      resolved.push(preset);
    }
  }

  resolvePresets(target);

  return resolved;
};
