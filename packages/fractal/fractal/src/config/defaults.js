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
          match: file => file.stem === 'view'
        }
      },
      match: file => file.stem === 'config'
    }
  },

  presets: [],

  adapters: [],

  plugins: [],

  transforms: []

};
