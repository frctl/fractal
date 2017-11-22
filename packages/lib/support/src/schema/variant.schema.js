module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    views: {
      anyOf: [{
        instanceof: 'FileCollection'
      }, {
        type: 'array'
      }]
    },
  },
  required: ['id']
};
