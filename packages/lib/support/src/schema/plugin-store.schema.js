const pluginSchema = require('./plugin.schema');

module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  definitions: {
    plugin: pluginSchema
  },
  oneOf: [
    {
      $ref: '#/definitions/plugin'
    },
    {
      type: 'array',
      items: {
        $ref: '#/definitions/plugin'
      }
    },
    {
      type: 'null'
    }
  ]
};
