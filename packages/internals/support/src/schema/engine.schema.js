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

    preprocessors: {
      type: 'array'
    },

    render: {
      typeof: 'function'
    }

  },

  required: ['name', 'match', 'render']

};
