const utils = require('@frctl/utils');
const multimatch = require('multimatch');
const assert = require('check-types').assert;

module.exports = function () {
  return {

    name: 'filterByPath',

    handler: function (paths) {
      paths = utils.toArray(paths);
      assert.array.of.string(paths, `files.filterByPath: path argument must be a string or array of strings [paths-invalid]`);
      return this.getAll().filter(file => {
        return multimatch([file.relative], paths).length;
      });
    }

  };
};
