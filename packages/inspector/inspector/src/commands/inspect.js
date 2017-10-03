const clipboardy = require('clipboardy');
const getPort = require('get-port');
const server = require('..//server');

module.exports = function (config = {}) {
  return {

    name: 'inspector-inspect',

    command: 'inspect',

    description: 'Start the Fractal component inspector',

    builder: {
      dev: {
        boolean: true
      }
    },

    async handler(argv, app, cli, {log}) {

      if (argv.dev) {
        log(`
          <br><cyan>Running in dev mode.</cyan>
          <dim>Initial webpack build may take some time. Be patient :-)</dim>
        `);
        config.dev = true;
      }

      const port = await getPort(config.port || 8888);

      const inspector = await server(app, config);

      process.on('SIGINT', () => {
        inspector.stop();
        log(`<br><cyan>Component inspector server stopped.</cyan><br>`);
        process.exit(0);
      });

      await inspector.start(port);

      const localUrl = `http://localhost:${port}`;
      clipboardy.writeSync(localUrl);

      return `
        <success>Component inspector started</success>
          <underline>${localUrl}</underline> <gray>(URL copied to clipboard)</gray>
          <cyan>Use ^c to quit</cyan>
      `;

    }

  };
};
