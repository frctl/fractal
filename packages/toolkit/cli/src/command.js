const yargs = require('yargs');
const {defaultsDeep} = require('@frctl/utils');
const {Validator} = require('@frctl/support');
const {error, log} = require('@frctl/console');
const debug = require('debug')('fractal:cli:command');
const schema = require('./command.schema');

module.exports = function (props, app, cli) {
  Validator.assertValid(props, schema, 'Command schema invalid [properties-invalid]: ');

  const command = defaultsDeep(props, {
    description: false,
    builder: {}
  });

  cli = Object.assign({}, cli, {command});

  command.handler = async function (argv) {
    debug(`running command '%s' with args %o`, command.name, argv);

    if (argv.help) {
      return yargs.showHelp();
    }

    try {
      const output = await Promise.resolve(props.handler(argv, app, cli));
      if (typeof output === 'string') {
        log(output);
      }
    } catch (err) {
      error(err);
    }
  };

  return command;
};
