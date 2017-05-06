const {Surveyor} = require('@frctl/surveyor');
const {Store} = require('@frctl/surveyor');

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
