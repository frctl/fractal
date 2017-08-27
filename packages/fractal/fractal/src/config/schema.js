module.exports = {

  type: 'object',

  required: ['configs', 'views'],

  properties: {

    src: {
      anyOf: [
        {type: 'string'},
        {type: 'array'},
        {type: 'null'}
      ]
    },

    cache: {
      type: 'object',
      required: ['ttl', 'check'],
      properties: {
        ttl: {
          type: 'integer'
        },
        check: {
          type: 'integer'
        }
      }
    },

    resolve: {
      type: 'object'
    },

    views: {
      type: 'object',
      required: ['filter'],
      properties: {
        filter: {
          anyOf: [
            {type: 'object'},
            {typeof: 'function'}
          ]
        }
      }
    },

    configs: {
      type: 'object',
      required: ['filter', 'defaults'],
      properties: {
        defaults: {type: 'object'},
        filter: {
          anyOf: [
            {type: 'object'},
            {typeof: 'function'}
          ]
        }
      }
    },

    presets: {
      anyOf: [
        {type: 'string'},
        {type: 'array'},
        {type: 'null'}
      ]
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
