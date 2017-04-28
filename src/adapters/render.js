const check = require('check-types');
const validate = require('../validate');

const assert = check.assert;

module.exports = function (adapter) {
  return function (args, state, app) {
    let [file, context, opts, callback] = args;

    if (typeof opts === 'function') {
      callback = opts;
      opts = {};
    }

    if (!callback) {
      callback = () => {};
    }

    validate.file(file);
    assert.object(context, `${adapter.name}.render: requires a 'context' argument of type object [context-invalid]`);
    assert.maybe.object(opts, `${adapter.name}.render: if an 'opts' argument is supplied it must be an object [opts-invalid]`);
    assert.function(callback, `${adapter.name}.render: requires a callback [callback-invalid]`);

    return adapter.render([file, context, opts, callback], state, app);
  };
};
