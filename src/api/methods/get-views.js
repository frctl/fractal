const _ = require('lodash');

module.exports = function () {
  return {

    name: 'getViews',

    handler: function (target) {
      return this.files.filter(file => file.role === 'view');
    }

  };
};
