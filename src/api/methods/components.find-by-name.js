const _ = require('lodash');

module.exports = function () {
  return {

    name: 'components.findByName',

    handler: function (name) {
      return _.find(this.components, {name: name});
    }

  };
};
