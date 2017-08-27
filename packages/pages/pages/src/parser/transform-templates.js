const {Collection} = require('@frctl/support');

module.exports = function (opts = {}) {
  return {

    name: 'templates',

    transform(files, state, app) {

      return Collection.from([]);
    }
  };
};
