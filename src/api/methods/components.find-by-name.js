const utils = require('@frctl/utils');
const multimatch = require('multimatch');

module.exports = {

  name: 'components.findByName',

  handler: function (paths) {
    return _.find(this.components, {name: args[0]});
  }

};
