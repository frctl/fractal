module.exports = {

  src: null,

  cache: {
    ttl: 0,
    check: 600
  },

  resolve: {
    alias: {
      '~': process.cwd()
    }
  },

  components: {
    match: file => file.stem.startsWith('@'),
    config: {
      match: '**/config.*',
      defaults: {
        views: {
          match: 'view.*',
          default: '.html'
        }
      }
    },
    templates: {
      helpers: {}
    }
  },

  presets: [],

  engines: [
    require('@frctl/fractal-engine-html')
  ],

  plugins: [],

  transforms: [
    require('@frctl/fractal-transform-components')
  ]

};
