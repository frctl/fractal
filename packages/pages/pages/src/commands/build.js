const Pages = require('../pages');

module.exports = function(opts = {}) {

  opts = [].concat(opts);

  return {

    name: 'pages-build',

    command: 'build [site]',

    description: 'Run a full Pages site build',

    builder: {
      dest: {
        describe: 'Build destination path',
        alias: 'd'
      }
    },

    async handler(argv, app, cli) {
      const options = argv.site ? opts.find(conf => conf.name === argv.site) : opts[0];
      if (!options) {
        throw new Error(`Could not find configuration for site '${argv.site}'`);
      }

      const site = new Pages(app, options);
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
