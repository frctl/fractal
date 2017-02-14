const _ = require('lodash');

module.exports = {

  name: 'getPreviews',

  handler: function (target) {
    if (typeof target === 'string') {
      target = this.find(target);
    }
    if (!target) {
      throw new Error(`getPreviews: could not find target`);
    }
    return target.files.filter(file => file.role === 'preview');
  }

};
