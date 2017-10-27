const {expect, validateSchema} = require('../../../../../test/helpers');
const componentSchema = require('./component.schema');

describe('Component schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(componentSchema)).to.equal(true);
  });
});
