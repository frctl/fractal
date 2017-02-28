const utils = require('@frctl/utils');
const multimatch = require('multimatch');

module.exports = function () {
  return {

    name: 'filterByPath',

    handler: function (paths) {
      return this.$data.filter(file => {
        return multimatch([file.relative], utils.toArray(paths)).length;
      });
    }

  };
};
