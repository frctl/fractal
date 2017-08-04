const loadPkg = require('./package-loader');

module.exports = function (targets) {
  return targets.map(target => loadPkg(target));
};
