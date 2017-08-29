module.exports = {

  src: null,

  assets: {
    filter: file => !['.njk', '.html'].includes(file.extname)
  },

  templates: {
    filter: file => ['.njk', '.html'].includes(file.extname)
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

  plugins: [
    require('../parser/plugin-hidden'),
    require('../parser/plugin-frontmatter'),
    require('../parser/plugin-permalink-assets'),
    require('../parser/plugin-permalink-templates')
  ],

  transforms: [
    require('../parser/transform-templates'),
    require('../parser/transform-assets')
  ]

};
