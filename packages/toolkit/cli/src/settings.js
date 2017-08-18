module.exports = {

  config: ['fractal.config.js', 'fractal.config.json'],

  usage: `\n$0 <command> [...]`,

  options: {

    debug: {
      describe: 'show debug output',
      global: true,
      boolean: true
    },

    help: {
      alias: ['h'],
      describe: 'get help',
      global: true,
      boolean: true
    },

    version: {
      describe: 'display version information',
      global: false,
      boolean: true
    }

  }

};
