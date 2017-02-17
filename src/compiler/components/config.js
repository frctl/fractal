const _ = require('lodash');
const utils = require('@frctl/utils');

module.exports = function () {
  // TODO: use schema to validate config properties!

  return function config(components) {
    return Promise.all(components.map(component => {
      const configFiles = component.files.filter(f => f.role === 'config');
      const data = _.sortBy(configFiles, 'path').map(f => f.parsed);

      component.config = utils.defaultsDeep({}, ...data, component.config || {});

      return component;
    }));
  };
};
