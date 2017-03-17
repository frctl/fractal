const _ = require('lodash');

module.exports = function (fractal) {
  return {

    name: 'findView',

    handler: function (target, adapter) {
      if (!fractal.defaultAdapter) {
        throw new Error(`components.findView: You must specify one or more view engine adapters [no-adapters]`);
      }
      let views;
      try {
        views = this.getViewsFor(target);
      } catch (err) {
        views = [];
      }
      if (!adapter && fractal.defaultAdapter) {
        adapter = fractal.defaultAdapter.name; // get the first registered adapter
      }
      return views.find(file => file.adapter === adapter);
    }

  };
};
