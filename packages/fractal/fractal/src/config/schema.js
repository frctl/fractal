module.exports = {

  type: 'object',

  required: ['components'],

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

    components: {
      type: 'object',
      required: ['config', 'match'],
      properties: {
        match: {
          anyOf: [
            {type: 'string'},
            {type: 'object'},
            {typeof: 'function'}
          ]
        },
        config: {
          type: 'object',
          required: ['match', 'defaults'],
          properties: {
            defaults: {
              type: 'object',
              required: ['views'],
              properties: {
                views: {
                  type: 'object',
                  required: ['match'],
                  properties: {
                    match: {
                      anyOf: [
                        {type: 'string'},
                        {type: 'object'},
                        {typeof: 'function'}
                      ]
                    }
                  }
                }
              }
            },
            match: {
              anyOf: [
                {type: 'object'},
                {type: 'string'},
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

    engines: {
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
