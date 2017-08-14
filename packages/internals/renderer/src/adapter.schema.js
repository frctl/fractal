module.exports = {

  properties: {

    name: {
      type: 'string'
    },

    match: {
      anyOf: [
        {
          type: 'array'
        },
        {
          type: 'string'
        },
        {
          typeof: 'function'
        }
      ]
    },

    render: {
      typeof: 'function'
    }

  },

  required: ['name', 'match', 'render']

};
