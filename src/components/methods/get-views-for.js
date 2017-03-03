const _ = require('lodash');

module.exports = function () {
  return {

    name: 'getViewsFor',

    handler: function (component) {
      if (typeof component === 'string') {
        component = this.findByName(component);
      }
      if (!component) {
        throw new Error(`components.getViewsFor: could not find component [component-not-found]`);
      }
      return component.files.filter(file => file.role === 'view');
    }

  };
};
