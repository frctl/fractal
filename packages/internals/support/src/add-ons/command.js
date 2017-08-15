const debug = require('debug')('fractal:support');
const Validator = require('../validator');
const schema = require('./command.schema');

const _props = new WeakMap();

class Command {

  constructor(props) {
    Validator.assertValid(props, schema, 'Command schema invalid [properties-invalid]');
    _props.set(this, props);
    debug('intialised command %s', props.name);
  }

  get name() {
    return _props.get(this).name;
  }

  get command() {
    return _props.get(this).command;
  }

  get description() {
    const props = _props.get(this);
    return props.description || false;
  }

  get builder() {
    return _props.get(this).builder || {};
  }

  get aliases() {
    return _props.get(this).aliases || [];
  }

  get handler() {
    return _props.get(this).handler;
  }

}

Command.schema = schema;

module.exports = Command;
