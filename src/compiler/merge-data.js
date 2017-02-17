const _ = require('lodash');

module.exports = function(data){
  const merged = {};
  for (const set of data) {
    _.forEach(set, (results, collection) => {
      merged[collection] = (merged[collection] || []).concat(results);
    });
  }
  return merged;
};
