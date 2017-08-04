const importCwd = require('import-cwd');

module.exports = function (target) {

  if (!Array.isArray(target)) {
    target = [target];
  }

  let [pkg, opts = {}] = target;

  if (typeof pkg === 'string') {
    pkg = importCwd(pkg);
  }

  return typeof pkg === 'function' ? pkg(opts) : pkg;
};
