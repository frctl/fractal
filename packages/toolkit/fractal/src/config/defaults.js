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
        name: 'config'
      }
    },
    views: {
      filter: {
        name: 'view'
      }
    }
  },

  extends: [],
  commands: [],
  adapters: [],
  plugins: [],
  transforms: [],

  cli: {},
  pages: {},
  inspector: {}

};
