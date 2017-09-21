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
