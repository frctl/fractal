const {omit} = require('lodash');
const Config = require('./config');

class ExtendedConfig extends Config {

  constructor(...args) {
    super(...args);
    this.addAccessor('extends', 'extends-resolver');
    const configs = this.get('extends', []).reverse();
    this.defaults(...configs.map(preset => omit(preset.config || {}, 'extends')));
  }

}

module.exports = ExtendedConfig;
