module.exports = {

  type: 'object',

  properties: {

    dest: {
      anyOf: [
        {type: 'string'},
        {type: 'null'}
      ]
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

  }

};
