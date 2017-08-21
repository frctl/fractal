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

    components: {
      type: 'object',
      required: ['views', 'config'],
      properties: {
        views: {
          type: 'object',
          properties: {
            filter: {
              anyOf: [
                {type: 'object'},
                {typeof: 'function'}
              ]
            }
          }
        },
        config: {
          type: 'object',
          properties: {
            defaults: {type: 'object'},
            filter: {
              anyOf: [
                {type: 'object'},
                {typeof: 'function'}
              ]
            }
          }
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
