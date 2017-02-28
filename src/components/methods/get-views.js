const _ = require('lodash');

module.exports = function () {
  return {

    name: 'getViews',

    handler: function () {
      return this.files.filter(file => file.role === 'view');
    }

  };
};
