const utils = require('@frctl/utils');
const multimatch = require('multimatch');

module.exports = function () {
  return {

    name: 'files.filterByPath',

    handler: function (paths) {
      return this.files.filter(file => {
        return multimatch([file.relative], utils.toArray(paths)).length;
      });
    }

  };
};
