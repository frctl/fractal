const utils = require('@frctl/utils');
const multimatch = require('multimatch');

module.exports = function() {

  return {

    name: 'resources.filterByPath',

    handler: function (paths) {
      return this.resources.filter(resource => {
        return multimatch([resource.relative], utils.toArray(paths)).length;
      });
    }

  };

};
