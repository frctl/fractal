const _ = require('lodash');
const Store = require('../store');
const validate = require('../validate');

class Adapters extends Store {

  find(name) {
    return super.find(adapter => name === adapter.name);
  }

  validate(adapter) {
    return validate.adapter(adapter);
  }

  get default() {
    return this.first();
  }

}

module.exports = Adapters;
