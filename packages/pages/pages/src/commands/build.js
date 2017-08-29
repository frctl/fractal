const Pages = require('../pages');

module.exports = function pagesInfoCommand(opts = {}) {
  return {

    name: 'pages-build',

    command: 'build',

    description: 'Run a full Pages site build',

    async handler(argv, app, cli) {
      const site = new Pages(app, opts);
      const pages = await site.build();

      console.log(pages);

      return `
        <success><reset>Fractal Pages build complete</reset></success>
      `;
    }
  };
};
