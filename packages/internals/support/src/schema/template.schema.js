module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {
    tree: {
      type: 'object'
    },
    filename: {
      type: 'string'
    }
  },
  required: ['tree', 'filename']
};
