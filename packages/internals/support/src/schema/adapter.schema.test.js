const {expect, validateSchema} = require('../../../../../test/helpers');
const adapterSchema = require('./adapter.schema');

describe('Adapter schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(adapterSchema)).to.equal(true);
  });
});
