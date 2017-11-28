module.exports = {

  src: null,

  cache: {
    ttl: 0,
    check: 600
  },

  resolve: {
    alias: {}
  },

  components: {
    match: file => file.stem.startsWith('@'),
    config: {
      match: '**/config.*',
      defaults: {
        views: {
          match: '**/view.*'
        }
      }
    },
    templates: {
      globals: {},
      helpers: {}
    }
  },

  presets: [],

  engines: [],

  plugins: [],

  transforms: [
    require('@frctl/fractal-transform-components')
  ]

};
