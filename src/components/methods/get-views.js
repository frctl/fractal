const _ = require('lodash');

module.exports = function (fractal) {

  return {

    name: 'getViews',

    handler: function (maxViews, minViews) {
      return this.getFiles().filterByRole('view');
    }

  };
};
