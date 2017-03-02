const _ = require('lodash');

module.exports = function () {
  return {

    name: 'findByName',

    handler: function (name) {
      return _.find(this.getAll(), {name: name});
    }

  };
};
