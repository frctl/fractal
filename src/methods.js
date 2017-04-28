const _ = require('lodash');
const Store = require('./store');
const validate = require('./validate');

class Methods extends Store {

  validate(method) {
    return validate.method(method);
  }

}

module.exports = Methods;
