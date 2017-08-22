const {expect, validateSchema} = require('../../../../../test/helpers');
const pluginSchema = require('./plugin.schema');

describe('Plugin schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(pluginSchema)).to.equal(true);
  });
});
