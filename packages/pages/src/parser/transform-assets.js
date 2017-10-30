const {forEach, omit} = require('lodash');

module.exports = function (opts = {}) {
  return {

    name: 'assets',

    transform(files, state, app) {
      let used = [];
      forEach(omit(state, 'files'), collection => {
        used = used.concat(...collection.mapToArray(f => f.path));
      });
      const assets = files.filter(file => file.isDirectory() !== true).filter(file => !used.includes(file.path));
      return assets.map(file => {
        file.type = 'asset';
        return file;
      });
    }
  };
};
