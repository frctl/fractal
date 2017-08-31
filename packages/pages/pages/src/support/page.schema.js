module.exports = {

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
