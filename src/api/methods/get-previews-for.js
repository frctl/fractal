const _ = require('lodash');

module.exports = {

  name: 'getPreviewsFor',

  handler: function (target) {
    if (typeof target === 'string') {
      target = this.components.findByName(target);
    }
    if (!target) {
      throw new Error(`getPreviewsFor: could not find target`);
    }
    return target.files.filter(file => file.role === 'preview');
  }

};
