module.exports = {

  src: null,

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
  },

  serve: {
    port: 4444
  },

  build: {
    port: 4444
  }

  // plugins: [
  //   require('../parser/plugin-hidden'),
  //   require('../parser/plugin-frontmatter'),
  //   require('../parser/plugin-permalink-templates'),
  //   require('../parser/plugin-permalink-assets')
  // ],
  //
  // transforms: [
  //   require('../parser/transform-templates'),
  //   require('../parser/transform-assets')
  // ]

};
