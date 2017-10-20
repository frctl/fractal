const {relative} = require('path');
const ora = require('ora');
const clipboardy = require('clipboardy');
const {toArray} = require('@frctl/utils');
const {Server} = require('@frctl/server');
const serve = require('../server');
const Pages = require('../app');

module.exports = function (config = {}) {
  const builder = {
    port: {
      describe: 'The port to start the server on',
      alias: 'p'
    },
    build: {
      describe: 'Run a full static build instead of running the dev server',
      alias: 'b',
      boolean: true
    },
    dest: {
      describe: 'Directory to generate the static pages into',
      alias: 'd',
      string: true
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
      const pages = new Pages(options);

      if (argv.build) {
        /*
         * Run a full static build of the site
         */

        const spinner = ora('Generatic static site build...').start();

        const output = await pages.build(fractal, {
          write: true
        });

        spinner.stop();

        return `
        <success>Static build complete</success>

          <dim>${output.length} files written to './${relative(cli.cwd, pages.get('dest'))}'</dim>
        `;
      }

      let server;
      let message;
      const port = argv.port || pages.get('server.port');

      if (argv.serve) {
        /*
         * Just serve the contents of the dest directory,
         * do not rebuild the site on requests. Useful for testing
         * the static build output.
         */

        server = new Server();
        server.addStatic(pages.get('dest'));
        await server.start(argv.port || pages.get('server.port'));

        message = `<success>Static server started</success><br>  <dim>Serving files from './${relative(cli.cwd, pages.get('dest'))}'</dim>`;
      } else {
        /*
         * Dev mode, rebuild each page on request and hold in memory
         * rather than writing to disk
         */

        server = await serve(fractal, pages, {port});
        message = `<success>Development server started</success>`;
      }

      process.on('SIGINT', () => {
        server.stop();
        log(`<br><cyan>Pages server stopped.</cyan><br>`);
        process.exit(0);
      });

      const localUrl = `http://localhost:${server.port}`;
      clipboardy.writeSync(localUrl);

      return `
        ${message}

          Local URL:   <underline>${localUrl}</underline>
          Network URL: <underline>${server.ip}</underline>

          <dim>Local URL copied to clipboard</dim>
          <cyan>Use ^c to quit</cyan>
      `;
    }
  };
};
