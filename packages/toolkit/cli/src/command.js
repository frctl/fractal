const yargs = require('yargs');
const {defaultsDeep} = require('@frctl/utils');
const {error, log} = require('@frctl/console');
const debug = require('debug')('fractal:cli');
const assert = require('check-types').assert;
const check = require('check-more-types');

const commandSchema = {
  name: check.unemptyString,
  command: check.unemptyString,
  description: check.maybe.unemptyString,
  builder: check.maybe.object,
  handler: function () {}
};

module.exports = function (props, app, env) {
  assert(
    check.schema(commandSchema, props),
    `Command.constructor: The properties provided do not match the schema of a command [properties-invalid]`,
    TypeError
  );

  const command = defaultsDeep(props, {
    description: false,
    builder: {}
  });

  command.handler = async function (argv) {
    debug(`running command: %s`, command.name);

    if (argv.help) {
      return yargs.showHelp();
    }

    try {
      const output = await Promise.resolve(props.handler(argv, app, env));
      if (typeof output === 'string') {
        log(output);
      }
    } catch (err) {
      error(err);
    }
  };

  return command;
};
