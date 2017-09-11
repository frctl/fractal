module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    default: {
      type: 'boolean'
    },
    component: {
      type: 'string'
    }
  },
  required: ['name', 'component']
};
