const clipboardy = require('clipboardy');
const ip = require('ip');
const Pages = require('../pages');

module.exports = function(opts = {}) {
  return {

    name: 'pages-author',

    command: 'author',

    description: 'Start a development server for you Pages sites',

    async handler(argv, app, cli) {
      const site = new Pages(app, opts);
      const server = await site.serve({dir: argv.dir});

      app.watch();
      site.watch();

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
