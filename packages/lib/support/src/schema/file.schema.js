// TODO: Improve File schema
module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {
    path: {
      type: 'string',
      minLength: 1
    },
    cwd: {
      type: 'string',
      minLength: 1
    },
    base: {
      type: 'string',
      minLength: 1
    }
  },
  anyOf: [{
    required: ['path']
  }, {
    required: ['history']
  }]
};
