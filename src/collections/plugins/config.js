const _ = require('lodash');
const utils = require('@frctl/utils');

module.exports = function () {
  // TODO: use schema to validate config properties

  return function config(collections) {
    return Promise.all(collections.map(collection => {
      const configFiles = collection.files.filter(f => f.role === 'config');
      const data = _.sortBy(configFiles, 'path').map(f => f.parsed);

      collection.config = utils.defaultsDeep({}, ...data, collection.config || {});

      return collection;
    }));
  };
};
