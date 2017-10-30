const loadPkg = require('./package-loader');

module.exports = function packagesLoader(targets) {
  return targets.map(target => loadPkg(target));
};
