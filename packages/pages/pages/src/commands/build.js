const Pages = require('../pages');

module.exports = function pagesInfoCommand(opts = {}) {
  return {

    name: 'pages-build',

    command: 'build',

    description: 'Run a full Pages site build',

    async handler(argv, app, cli) {
      const pages = new Pages(app, opts);

      const collections = await pages.build();

      console.log(collections.site.pages.toArray());

      return `
        <success><reset>Fractal Pages build complete</reset></success>
      `;
    }
  };
};
