module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {
    config: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string'
        },
        default: {
          type: 'boolean'
        },
        templates: {
          type: 'object'
        }
      }
    },
    component: {
      type: 'string'
    }
  }
};
