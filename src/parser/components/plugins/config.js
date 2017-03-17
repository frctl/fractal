const _ = require('lodash');
// const utils = require('@frctl/utils');

module.exports = function () {
  // TODO: use schema to validate config properties!

  return function setConfig(components) {
    // Arguments here do not require checking as this function will always be wrapped in function with checks
    return Promise.all(components.map(component => {
      const configFiles = component.files.filter(f => f.role === 'config');
      const data = _.sortBy(configFiles, 'path').map(f => f.parsed);
      component.config = _.assign({}, ...data, component.config || {});
      return component;
    }));
  };
};
