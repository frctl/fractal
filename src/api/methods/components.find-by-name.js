const _ = require('lodash');
const utils = require('@frctl/utils');
const multimatch = require('multimatch');

module.exports = function(){

  return {

    name: 'components.findByName',

    handler: function (name) {
      return _.find(this.components, {name: name});
    }

  };

};
