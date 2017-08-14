const {Validator} = require('@frctl/support');
const schema = require('./plugin.schema');

class Plugin {

  constructor(props={}) {
    console.log(Validator.assertValid(props, schema, 'Plugin schema invalid [invalid-properties]'));
    Object.assign(this, props);
  }

  get [Symbol.toStringTag]() {
    return 'Plugin';
  }
}

module.exports = Plugin;
