const _ = require('lodash');

module.exports = function () {
  return {

    name: 'getAll',

    handler: function () {
      const all = [];
      for (const set of _.values(this.$data)) {
        all.concat(set);
      }
      return all;
    }

  };
};
