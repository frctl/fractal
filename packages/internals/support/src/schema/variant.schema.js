module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    default: {
      type: 'boolean'
    },
    component: {
      type: 'string'
    }
  },
  required: ['id', 'component']
};
