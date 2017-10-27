const {ExtendedConfig} = require('@frctl/config');
const defaults = require('./defaults');
const schema = require('./schema');

class ConfigStore extends ExtendedConfig {

  constructor(data) {
    const accessors = [{
      path: ['plugins', 'engines', 'transforms'],
      handler: 'packages-loader'
    }];
    super(data, {schema, defaults, accessors});
  }

}

module.exports = ConfigStore;
