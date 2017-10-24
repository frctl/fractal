/* eslint max-depth: off */
const {VM} = require('vm2');

module.exports = function evalInVM(code, context = {}, env = {}) {
  const vm = new VM({
    timeout: 1000,
    sandbox: context,
    builtin: ['*']
  });

  /*
   * Try and run the code in the sandbox.
   * Because undefined top-level properties are effectively undeclared
   * we catch those errors, add a declaration at the top of the code
   * block and then try again with those vars now declared, but undefined,
   * which is the expected behaviour in this scenario.
   * TODO: is there a nicer way to handle this?
   */
  try {
    return vm.run(code);
  } catch (err) {
    let lastError = err;
    if (err.stack.includes('ReferenceError')) {
      while (lastError) {
        try {
          let uninit = lastError.message.replace(' is not defined', '');
          code = `let ${uninit};\n${code}`;
          return vm.run(code);
        } catch (err) {
          if (err.stack.includes('ReferenceError')) {
            lastError = err;
          } else {
            throw err;
          }
        }
      }
    }
    throw lastError;
  }
};
