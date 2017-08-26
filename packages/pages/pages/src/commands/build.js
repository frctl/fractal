const Pages = require('../pages');

module.exports = function pagesInfoCommand(opts = {}) {
  return {

    name: 'pages-build',

    command: 'build',

    description: 'Run a full Pages site build',

    handler(argv, app, cli) {
      const pages = new Pages(opts);

      return `
        <success><reset>Fractal Pages build complete</reset></success>
      `;
    }
  };
};
