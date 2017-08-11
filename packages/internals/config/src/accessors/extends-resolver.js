const {toArray} = require('@frctl/utils');
const loadPkgs = require('./packages-loader');

module.exports = function extendsResolver(target) {
  let resolved = [];

  function resolveExtends(preset) {
    const presets = loadPkgs(toArray(preset));
    for (const preset of presets) {
      if (resolved.find(config => config.name === preset.name)) {
        continue; // already been applied, skip
      }
      if (preset.config && Array.isArray(preset.config.extends)) {
        // the preset itself specifies presets to extend from
        resolveExtends(preset.config.extends);
      }
      resolved.push(preset);
    }
  }

  resolveExtends(target);

  return resolved;
};
