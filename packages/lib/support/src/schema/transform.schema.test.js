const {expect, validateSchema} = require('../../../../../test/helpers');
const transformSchema = require('./transform.schema');

describe('Transform schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(transformSchema)).to.equal(true);
  });
});
