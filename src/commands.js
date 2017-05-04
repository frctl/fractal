const Surveyor = require('@frctl/surveyor').Surveyor;
const Store = require('@frctl/surveyor').Store;

const commandSpec = {
  type: 'object',
  props: {
    command: 'string',
    description: 'string',
    handler: 'function'
  }
};

class Commands extends Store {

  constructor(items) {
    super(items, {
      validator: item => Surveyor.validate('command', item, commandSpec)
    });
  }

}

module.exports = Commands;
