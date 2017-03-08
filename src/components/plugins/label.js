// const _ = require('lodash');
const utils = require('@frctl/utils');

module.exports = function () {
  return function setLabel(components, done) {
    // Arguments here do not require checking as this function will always be wrapped in function with checks
    components.forEach(component => {
      if (component.config && component.config.label) {
        component.label = component.config.label;
      } else {
        component.label = utils.titlize(utils.normaliseName(component.name));
      }
    });

    done();
  };
};
