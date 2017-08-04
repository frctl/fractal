const resolvePkg = require('./package');

module.exports = function (targets) {
  return targets.map(target => resolvePkg(target));
};
