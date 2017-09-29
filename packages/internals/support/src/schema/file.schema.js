// TODO: Improve File schema
module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {
    path: {
      type: 'string'
    },
    cwd: {
      type: 'string'
    },
    base: {
      type: 'string'
    }
  },
  anyOf: [{
    required: ['path']
  }, {
    required: ['history']
  }]
};
