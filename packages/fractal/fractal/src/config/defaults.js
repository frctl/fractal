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
          match: 'view.*',
          default: '.html'
        },
        assets: {
          styles: '**/*.{css,scss,less}',
          scripts: '**/*.{js,cs,ts,jsx}',
          images: '**/*.{svg,png,jpg,jpeg,gif}'
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
