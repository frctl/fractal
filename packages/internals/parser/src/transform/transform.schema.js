const pluginStoreSchema = require('./plugin-store.schema');
const pluginSchema = require('./plugin.schema');

module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  definitions: {
    pluginStore: pluginStoreSchema,
    plugin: pluginSchema
  },
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    transform: {
      typeof: 'function'
    },
    plugins: {$ref: '#/definitions/pluginStore'},
    passthru: {
      type: 'boolean'
    }
  },

  required: ['name', 'transform']
};
