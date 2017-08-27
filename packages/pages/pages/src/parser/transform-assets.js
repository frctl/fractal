const {Collection} = require('@frctl/support');

module.exports = function (opts = {}) {
  return {

    name: 'assets',

    transform(files, state, app) {

      return Collection.from([]);
    }
  };
};
