const {Validator} = require('@frctl/support');
const schema = require('@frctl/support/schema');

class Plugin {

  constructor(props = {}) {
    Validator.assertValid(props, schema.plugin, 'Plugin schema invalid [invalid-properties]');
    Object.assign(this, props);
  }

  get [Symbol.toStringTag]() {
    return 'Plugin';
  }
}

module.exports = Plugin;
