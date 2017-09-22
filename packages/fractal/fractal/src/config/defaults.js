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
      defaults: {
        views: {
          match: 'view.*'
        },
        assets: {
          match: '*.js'
        }
      },
      match: 'config.*'
    }
  },

  presets: [],

  adapters: [],

  plugins: [],

  transforms: []

};
