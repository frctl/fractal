module.exports = {

  type: 'object',

  properties: {

    dest: {
      type: 'string'
    },

    src: {
      anyOf: [
        {type: 'string'},
        {type: 'array'},
        {type: 'null'}
      ]
    },

    plugins: {
      type: 'array'
    },

    transforms: {
      type: 'array'
    }

  },

  required: ['dest']

};
