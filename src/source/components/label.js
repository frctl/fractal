const utils = require('@frctl/utils');

module.exports = function () {
  return function setLabel(components, done) {
    components.forEach(component => {
      if (component.config.label) {
        component.label = component.config.label;
      } else {
        component.label = utils.titlize(component.name);
      }
    });

    done();
  };
};
