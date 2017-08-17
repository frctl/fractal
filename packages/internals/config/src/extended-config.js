const {omit} = require('lodash');
const Config = require('./config');

class ExtendedConfig extends Config {

  constructor(...args) {
    super(...args);
    this.addAccessor('extends', 'extends-resolver');
    const presets = this.get('extends', []).reverse();
    const configs = presets.map(preset => omit(preset.config || {}, 'extends'));
    configs.forEach(config => this.addDefaults(config));
  }

  addDefaults(data, customizer) {
    customizer = customizer || concatArrays;
    return super.addDefaults(data, customizer);
  }

}

function concatArrays(targetValue, defaultValue, key) {
  targetValue = typeof targetValue === 'undefined' ? [] : targetValue;
  defaultValue = typeof defaultValue === 'undefined' ? [] : defaultValue;
  if (Array.isArray(targetValue) && Array.isArray(defaultValue)) {
    return [...defaultValue, ...targetValue];
  }
}

module.exports = ExtendedConfig;
module.exports.concatArrays = concatArrays;
