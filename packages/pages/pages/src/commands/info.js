const Pages = require('../pages');

module.exports = function pagesInfoCommand(opts = {}) {
  return {

    name: 'fractal-pages-info',

    command: 'pages',

    description: 'Get information about your Pages site(s)',

    handler(argv, app, cli) {
      const pages = new Pages(opts);

      return `
        <hr>

        <green>Fractal Pages <dim>${pages.version}</dim></green>

        <hr>
      `;
    }
  };
};
