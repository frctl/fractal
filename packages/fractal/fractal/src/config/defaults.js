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
          match: 'view.*',
          default: null
        }
      },
      match: 'config.*'
    }
  },

  presets: [],

  engines: [],

  plugins: [],

  transforms: []

};
