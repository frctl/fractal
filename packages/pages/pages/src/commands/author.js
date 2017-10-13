const clipboardy = require('clipboardy');
const {toArray} = require('@frctl/utils');
const serve = require('../server');
const Pages = require('../app');

module.exports = function (config = {}) {
  const builder = {
    port: {
      describe: 'The port to start the server on',
      alias: 'p'
    }
  };

  if (Array.isArray(config)) {
    builder.site = {
      describe: 'The target site name',
      alias: 's'
    };
  }

  return {

    name: 'pages-author',

    command: 'author',

    description: 'Author a Fractal pages site',

    builder,

    async handler(argv, fractal, cli, {log}) {
      config = toArray(config);

      const options = argv.site ? config.find(conf => conf.name === argv.site) : config[0];
      const port = argv.port || config.port || 7777;
      const pages = new Pages(options);
      const server = await serve(fractal, pages, {port});

      process.on('SIGINT', () => {
        server.stop();
        log(`<br><cyan>Pages server stopped.</cyan><br>`);
        process.exit(0);
      });

      const localUrl = `http://localhost:${server.port}`;
      clipboardy.writeSync(localUrl);

      return `
        <success>Pages development server started</success>

          Local URL:   <underline>${localUrl}</underline>
          Network URL: <underline>${server.ip}</underline>

          <gray>Local URL copied to clipboard</gray>
          <cyan>Use ^c to quit</cyan>
      `;
    }
  };
};
