const _ = require('lodash');

module.exports = function () {
  return function setName(components, done) {
    components.forEach(component => {
      if (component.config.name) {
        component.name = component.config.name;
      }
      component.name = _.kebabCase(component.name.replace(/^[^a-zA-Z]/, ''));
      component.handle = `@${component.name}`;
    });

    done();
  };
};
