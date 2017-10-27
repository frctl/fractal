module.exports = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  type: 'object',
  properties: {

    id: {
      type: 'string'
    },

    permalink: {
      type: 'string'
    },

    contents: {
      anyOf: [
        {
          type: 'string'
        },
        {
          instanceof: 'Buffer'
        }
      ]
    },

    children: {
      type: 'array'
    },

    render: {
      type: 'boolean'
    },

    data: {
      type: 'object'
    },

    template: {
      instanceof: 'File'
    }
  },

  required: ['id', 'permalink', 'contents']

};
