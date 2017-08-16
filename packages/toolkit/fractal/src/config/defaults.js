module.exports = {

  src: null,

  cache: {
    ttl: 0,
    check: 600
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

  extends: [],
  commands: [],
  adapters: [],
  plugins: [],
  transforms: []

};
