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
      anyOf: [
        {
          type: 'string'
        },
        {
          type: 'array'
        },
        {
          type: 'null'
        }
      ]
    },

    cache: {
      anyOf: [
        {
          type: 'boolean',
          enum: [false]
        },
        {
          type: 'integer'
        }
      ]
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
