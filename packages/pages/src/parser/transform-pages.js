const {forEach} = require('lodash');
const Router = require('../router');

module.exports = function (opts = {}) {
  return {

    name: 'pages',

    async transform(files, site, app) {
      const library = await app.fractal.getCollections();
      const router = new Router();
      const opts = app.get('pages');
      forEach(app.get('routes', {}), (builder, name) => {
        router.addRoute(name, builder, {site, library}, opts);
      });
      return router.getPages();
    }
  };
};
