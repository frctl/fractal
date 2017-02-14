const _ = require('lodash');

module.exports = {

  name: 'find',

  handler: function (...args) {
    const components = this.getComponents();
    if (args.length === 1) {
      return _.find(components, {name: args[0]});
    }
    return _.find(components, ...args);
  }

};
