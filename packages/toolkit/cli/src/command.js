const {omit} = require('lodash');
const yargs = require('yargs');
const {Validator} = require('@frctl/support');
const {error, log} = require('@frctl/console');
const debug = require('debug')('fractal:cli');
const schema = require('./command.schema');

const _props = new WeakMap();

class Command {

  constructor(props, ...args) {
    Validator.assertValid(props, schema, 'Command schema invalid [properties-invalid]: ');
    _props.set(this, props);

    // have to assign this in the constructor because yargs messes
    // with the `this` binding of command handlers
    this.handler = async function (argv) {
      debug(`running command '%s' with args %o`, props.name, argv);

      if (argv.help) {
        return yargs.showHelp();
      }

      try {
        const output = await Promise.resolve(props.handler(argv, ...args));
        if (typeof output === 'string') {
          log(output);
        }
      } catch (err) {
        error(err);
      }
    };

    Object.assign(this, omit(props, ['description', 'builder', 'handler']));
  }

  get description() {
    const props = _props.get(this);
    return props.description || props.desc || props.describe || false;
  }

  get builder() {
    return _props.get(this).builder || {};
  }

}

module.exports = Command;
