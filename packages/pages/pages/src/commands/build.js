const Pages = require('../pages');

module.exports = function(opts = {}) {
  return {

    name: 'pages-build',

    command: 'build',

    description: 'Run a full Pages site build',

    async handler(argv, app, cli) {
      const site = new Pages(app, opts);
      const result = await site.build({
        dest: argv.dest
      });

      const pageCount = result.pages.length;

      return `
        <success><reset>Fractal Pages build complete.</reset></success>
        <dim>  ${pageCount} page${pageCount === 1 ? '' : 's'} generated into ${result.dest}</dim>
      `;
    }
  };
};
