const {omit} = require('lodash');
const Config = require('./config');

class ExtendedConfig extends Config {

  constructor(...args) {
    super(...args);
    this.addAccessor('extends', 'extends-resolver');
    const presets = this.get('extends', []).reverse();
    this.addDefaults(...presets.map(preset => omit(preset.config || {}, 'extends')));
  }

}

module.exports = ExtendedConfig;
