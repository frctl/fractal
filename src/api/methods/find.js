const _ = require('lodash');

module.exports = function(){

  return {

    name: 'find',

    handler: function (...args) {
      if (args.length === 1 && typeof args[0] === 'string') {
        return _.find(this.components, {name: args[0]});
      }
      return _.find(this.getAll(), ...args);
    }

  };

};
