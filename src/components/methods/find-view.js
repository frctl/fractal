const _ = require('lodash');

module.exports = function (fractal) {
  return {

    name: 'findView',

    handler: function (target, adapter) {
      const views = this.getViewsFor(target);
      if (!adapter) {
        adapter = fractal.adapters[0]; // get the first registered adapter
      }
      return views.find(file => file.adapter === adapter);
    }

  };
};
