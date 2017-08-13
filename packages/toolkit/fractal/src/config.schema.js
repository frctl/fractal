const stringArray = [
  {
    type: 'string'
  },
  {
    type: 'array'
  }
];

module.exports = {

  properties: {

    extends: {
      anyOf: stringArray
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
      anyOf: stringArray
    }

  }

};
