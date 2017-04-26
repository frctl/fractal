const _ = require('lodash');
const assert = require('check-types').assert;
const fs = require('@frctl/ffs');

module.exports = {

  config(config) {
    assert.maybe.object(config, `Configuration must be supplied as an object [config-invalid]`);
  },

  src(src) {
    assert.string(src, `src must be an string [src-invalid]`);
  },

  file(file) {
    assert.instance(file, fs.File, `file is not a valid File object [file-invalid]`);
  },

  entityType(type, entities = ['files', 'components']) {
    assert.includes(entities, type, `Target entity type must be one of [${entities.join(',')}] [entity-invalid]`);
  },

  plugin(plugin) {
    assert.function(plugin, `Plugins must be functions [plugin-invalid]`);
  },

  extension(extension) {
    assert.function(extension, `Extensions must be functions [extension-invalid]`);
  },

  method(method) {
    validateObj('method', method, {
      name: 'string',
      handler: 'function'
    });
  },

  command(command) {
    validateObj('command', command, {
      command: 'string',
      description: 'string',
      handler: 'function'
    });
  },

  adapter(adapter) {
    validateObj('adapter', adapter, {
      name: 'string',
      match: 'string',
      render: 'function'
    });
  },

  transformer(transformer) {
    assert.function(transformer, `Transformers must be functions [transformer-invalid]`);
  },

  callback(callback) {
    assert.function(callback, `callback must be a function [callback-invalid]`);
  }

};

function validateObj(what, obj, props = {}) {
  const propNames = _.keys(props);
  for (const prop of propNames) {
    if (typeof obj[prop] === 'undefined') {
      throw new TypeError(`${what}s must be objects with props '${propNames.join(', ')}' [${what}-invalid]`);
    }
  }
  _.forEach(props, (type, prop) => {
    assert[type](obj[prop], `${what}.render must be a ${type} [${what}-${prop}-invalid]`);
  });
}
