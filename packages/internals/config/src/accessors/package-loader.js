const {isPlainObject} = require('lodash');
const importCwd = require('import-cwd');

module.exports = function (target) {
  if (!Array.isArray(target)) {
    target = [target];
  }

  let [pkg, opts = {}] = target;

  if (typeof pkg === 'string') {
    pkg = importCwd(pkg);
  }

  if (typeof pkg !== 'function' && !isPlainObject(pkg)) {
    throw new TypeError(`loaded package must resolve to a function or object [package-invalid]`);
  }

  return typeof pkg === 'function' ? pkg(opts) : pkg;
};
