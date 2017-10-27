const schema = require('@frctl/support/schema');
const {Validator} = require('@frctl/support');

const _props = new WeakMap();

class Command {

  constructor(props) {
    Validator.assertValid(props, schema.command, 'Command schema invalid [properties-invalid]');
    _props.set(this, props);
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

module.exports = Command;
