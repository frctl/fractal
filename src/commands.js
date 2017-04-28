const _ = require('lodash');
const Store = require('./store');
const validate = require('./validate');

class Commands extends Store {

  validate(command) {
    return validate.command(command);
  }

}

module.exports = Commands;
