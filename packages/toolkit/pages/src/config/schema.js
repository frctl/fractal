module.exports = {

  type: 'object',

  properties: {

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
    },

  }

};
