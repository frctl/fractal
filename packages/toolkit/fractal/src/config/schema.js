module.exports = {

  properties: {

    presets: {
      type: 'array'
    },

    commands: {
      type: 'array'
    },

    plugins: {
      type: 'array'
    },

    adapters: {
      type: 'array'
    },

    extensions: {
      type: 'array'
    },

    src: {
      anyOf: [
        {
          type: 'string'
        },
        {
          type: 'array'
        }
      ]
    }

  }

};
