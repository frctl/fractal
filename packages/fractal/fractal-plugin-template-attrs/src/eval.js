const vm = require('vm');

module.exports = function evalInVM(code, context = {}, opts = {}) {
  const resultKey = `evalInVM_${Math.floor(Math.random() * 1000000)}`;
  const sandbox = {
    [resultKey]: {}
  };
  Object.assign(sandbox, context);
  vm.runInNewContext(`${resultKey}=${code}`, sandbox, opts);
  return sandbox[resultKey];
};
