const {expect, validateSchema} = require('../../../../../test/helpers');
const variantSchema = require('./variant.schema');

describe('Variant schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(variantSchema)).to.equal(true);
  });
});
