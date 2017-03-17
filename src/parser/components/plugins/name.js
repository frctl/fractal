// const _ = require('lodash');
const utils = require('@frctl/utils');

module.exports = function () {
  return function setName(components, done) {
    // Arguments here do not require checking as this function will always be wrapped in function with checks
    components.forEach(component => {
      if (component.config && component.config.name) {
        component.name = component.config.name;
      }
      component.name = utils.normaliseName(component.name);
    });

    done();
  };
};
