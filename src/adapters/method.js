const check = require('check-types');
const validate = require('../validate');

const assert = check.assert;

module.exports = function (adapter) {
  return function (file, context, done) {
    validate.file(file);
    assert.object(context, `${adapter.name}.render: requires a 'context' argument of type object [context-invalid]`);
    assert.function(done, `${adapter.name}.render: requires a 'done' callback [done-invalid]`);

    return adapter.render(file, context, done);
  };
};
