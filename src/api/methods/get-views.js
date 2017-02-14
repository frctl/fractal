const _ = require('lodash');

module.exports = {

  name: 'getViews',

  handler: function (target) {
    if (typeof target === 'string') {
      target = this.find(target);
    }
    if (!target) {
      throw new Error(`getViews: could not find target`);
    }
    return target.files.filter(file => file.role === 'view');
  }

};
