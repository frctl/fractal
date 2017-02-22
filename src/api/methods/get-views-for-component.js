const _ = require('lodash');

module.exports = function () {
  return {

    name: 'getViewsForComponent',

    handler: function (target) {
      if (typeof target === 'string') {
        target = this.components.findByName(target);
      }
      if (!target) {
        throw new Error(`getViewsFor: could not find target`);
      }
      return target.files.filter(file => file.role === 'view');
    }

  };
};
