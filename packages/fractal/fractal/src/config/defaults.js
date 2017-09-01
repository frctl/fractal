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
    filter: file => file.stem.startsWith('@')
  },

  configs: {
    defaults: {},
    filter: {
      stem: 'config'
    }
  },

  views: {
    filter: {
      stem: 'view'
    }
  },

  presets: [],

  adapters: [],

  plugins: [],

  transforms: []

};
