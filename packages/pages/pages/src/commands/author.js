const clipboardy = require('clipboardy');
const ip = require('ip');
const Pages = require('../pages');

module.exports = function(opts = {}) {

  opts = [].concat(opts);

  return {

    name: 'pages-author',

    command: 'author [site]',

    description: 'Start a development server for your Pages site(s)',

    builder: {
      dest: {
        describe: 'Build destination path',
        alias: 'd'
      },
      port: {
        describe: 'Port to start the server on',
        alias: 'p'
      }
    },

    async handler(argv, app, cli) {
      const options = argv.site ? opts.find(conf => conf.name === argv.site) : opts[0];
      if (!options) {
        throw new Error(`Could not find configuration for site '${argv.site}'`);
      }

      const site = new Pages(app, options);
      const server = await site.serve({
        dest: argv.dest,
        port: argv.port
      });

      app.watch().on('all', () => app.parse());
      site.watch().on('all', () => site.parse());

      const localUrl = `http://localhost:${server.port}`;
      const networkUrl = `http://${ip.address()}:${server.port}`;

      clipboardy.writeSync(localUrl);

      return `
        <success>Development server started</success>

        Local URL: <cyan>${localUrl}</cyan> <dim>(copied to clipboard)</dim>
        Network URL: <cyan>${networkUrl}</cyan>

        <dim>Watching filesystem for changes...</dim>
      `;
    }
  };
};
