module.exports = {

  src: null,

  assets: {

  },

  templates: {

  },

  pages: {

  },

  routes: {

  },

  plugins: [],

  transforms: [
    require('../parser/transform-templates'),
    require('../parser/transform-assets'),
    require('../parser/transform-pages')
  ]

};
