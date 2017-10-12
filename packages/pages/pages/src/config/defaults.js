module.exports = {

  src: null,

  dest: null,

  templates: {
    match: ['.njk', '.html'],
    filter: null
  },

  assets: {

  },

  pages: {
    defaults: {},
    ext: '.html',
    indexes: true
  },

  routes: {
    pages: {
      collection: 'site.templates',
      filter: {hidden: false}
    },
    assets: {
      collection: 'site.assets',
      filter: {hidden: false}
    }
  },

  site: {},

  nunjucks: {
    globals: {},
    filters: {},
    extensions: {},
    opts: {
      filters: {},
      extensions: {}
    }
  }

};
