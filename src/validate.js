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

  extension(extension){
    assert.function(extension, `Extensions must be functions [extension-invalid]`);
  },

  method(method) {
    assert.object(method, `Methods must be objects [method-invalid]`);
    assert.string(method.name, `Method name must be a string [method-name-invalid]`);
    assert.function(method.handler, `Method handler must be a function [method-handler-invalid]`);
  },

  command(cmd) {
    assert.object(cmd, `Commands must be objects [command-invalid]`);
    assert.string(cmd.command, `Command.command must be a string [command-command-invalid]`);
    assert.string(cmd.description, `Command.description must be a string [command-description-invalid]`);
    assert.function(cmd.handler, `Command.handler must be a function [command-handler-invalid]`);
  },

  adapter(adapter) {
    assert.object(adapter, `Adapters must be objects [adapter-invalid]`);
    assert.string(adapter.name, `Adapter.name must be a string [adapter-name-invalid]`);
    assert.function(adapter.render, `Adapter.render must be a function [adapter-render-invalid]`);
  },

  transformer(transformer) {
    assert.function(transformer, `Transformers must be functions [transformer-invalid]`);
  },

  callback(callback) {
    assert.function(callback, `callback must be a function [callback-invalid]`);
  }

};
