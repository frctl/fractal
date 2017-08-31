const Pages = require('../pages');

module.exports = function(opts = {}) {
  return {

    name: 'pages-info',

    command: 'pages',

    description: 'Get information about your Pages site(s)',

    handler(argv, app, cli) {
      const pages = new Pages(opts);

      return `
        <green>Fractal Pages <dim>${pages.version}</dim></green>
      `;
    }
  };
};
