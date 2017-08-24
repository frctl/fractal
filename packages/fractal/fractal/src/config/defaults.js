module.exports = {

  src: null,

  cache: {
    ttl: 0,
    check: 600
  },

  alias: {
    '~': process.cwd()
  },

  components: {

    config: {
      defaults: {},
      filter: {
        stem: 'config'
      }
    },

    views: {
      filter: {
        stem: 'view'
      }
    }
  },

  presets: [],

  adapters: [],

  plugins: [],

  transforms: []

};
