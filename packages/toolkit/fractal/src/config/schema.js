module.exports = {

  type: 'object',

  properties: {

    src: {
      anyOf: [
        {
          type: 'string'
        },
        {
          type: 'array'
        }
      ]
    },

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

    adapters: {
      type: 'array'
    },

    plugins: {
      type: 'array'
    },

    transforms: {
      type: 'array'
    }

  }

};
