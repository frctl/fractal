module.exports = {

  properties: {

    name: {
      type: 'string'
    },

    description: {
      anyOf: [
        {
          type: 'string'
        },
        {
          type: 'boolean',
          enum: [false]
        }
      ]
    },

    builder: {
      anyOf: [
        {
          type: 'object'
        },
        {
          typeof: 'function'
        }
      ]
    },

    handler: {
      typeof: 'function'
    }

  },

  required: ['name', 'command', 'handler']

};
