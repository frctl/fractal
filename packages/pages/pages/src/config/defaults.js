module.exports = {

  src: null,

  dest: null,

  clean: '**/*',

  server: {
    port: 7777
  },

  templates: {
    match: ['.njk', '.html'],
    filter: null
  },

  assets: {

  },

  pages: {
    defaults: {},
    ext: '.html',
    indexes: false
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
      filters: {
        beautify: {
          html: {
            unformatted: ['code', 'pre', 'em', 'strong', 'span'],
            indent_inner_html: true,
            indent_char: ' ',
            indent_size: 2,
            sep: '\n'
          }
        }
      },
      extensions: {}
    }
  },

  plugins: [
    require('../parser/plugin-frontmatter'),
    require('../parser/plugin-hidden'),
    require('../parser/plugin-permalink-templates'),
    require('../parser/plugin-permalink-assets')
  ],

  transforms: [
    require('../parser/transform-templates'),
    require('../parser/transform-assets')
  ]

};
