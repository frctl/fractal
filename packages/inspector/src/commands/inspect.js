const clipboardy = require('clipboardy');
const server = require('../server');

module.exports = function (config = {}) {
  return {

    name: 'inspector-inspect',

    command: 'inspect',

    aliases: ['inspector'],

    description: 'Start the Fractal component inspector',

    builder: {
      dev: {
        boolean: true
      },
      port: {
        describe: 'The port to start the server on',
        alias: 'p'
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

      config.plugins.forEach(plugin => app.addPlugin(plugin));

      const inspector = await server(app, config);

      process.on('SIGINT', () => {
        inspector.stop();
        log(`<br><cyan>Component inspector server stopped.</cyan><br>`);
        process.exit(0);
      });

      await inspector.start(argv.port || config.port || 8888);

      const localUrl = `http://localhost:${inspector.port}`;
      clipboardy.writeSync(localUrl);

      return `
        <success>Component inspector started</success>

          Local URL:   <underline>${localUrl}</underline>
          Network URL: <underline>${inspector.ip}</underline>

          <gray>Local URL copied to clipboard</gray>
          <cyan>Use ^c to quit</cyan>
      `;
    }

  };
};
