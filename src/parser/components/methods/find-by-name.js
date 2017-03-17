const _ = require('lodash');
const assert = require('check-types').assert;

module.exports = function () {
  return {

    name: 'findByName',

    handler: function (name) {
      assert.string(name, `components.findByName: name must be a string [name-invalid]`);
      return _.find(this.getAll(), {name: name});
    }

  };
};
