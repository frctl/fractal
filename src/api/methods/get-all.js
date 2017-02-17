const _ = require('lodash');

module.exports = {

  name: 'getAll',

  handler: function () {
    const all = [];
    for (const set of _.values(this.$data)) {
      result.concat(set);
    }
    return all;
  }

};
