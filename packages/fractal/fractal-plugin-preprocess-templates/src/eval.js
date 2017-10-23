const {VM} = require('vm2');

module.exports = function evalInVM(code, context = {}, opts = {}) {
  const vm = new VM({
    timeout: 1000,
    sandbox: context
  });

  try {
    return vm.run(code);
  } catch (err) {
    if (err.message.indexOf('ReferenceError') === -1) {
      return false;
    }
    throw err;
  }
};
