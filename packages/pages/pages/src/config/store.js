const {ExtendedConfig} = require('@frctl/config');
const {normalizePath} = require('@frctl/utils');
const defaults = require('./defaults');
const schema = require('./schema');

class ConfigStore extends ExtendedConfig {

  constructor(data) {
    const accessors = [{
      path: ['plugins', 'transforms'],
      handler: 'packages-loader'
    },{
      path: 'dest',
      handler: path => normalizePath(path)
    }];

    super(data, {schema, defaults, accessors});
  }

}

module.exports = ConfigStore;
