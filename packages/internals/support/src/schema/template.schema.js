module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {
    contents: {
      oneOf: [{
        type: 'string'
      }, {
        type: 'object'
      }]
    },
    filename: {
      type: 'string'
    }
  },
  required: ['contents', 'filename']
};
