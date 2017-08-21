module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    collection: {
      type: 'string'
    },
    handler: {
      typeof: 'function'
    }
  },
  required: ['name', 'handler']
};
