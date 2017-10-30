const {expect, validateSchema} = require('../../../../../test/helpers');
const templateSchema = require('./template.schema');

describe('Template schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(templateSchema)).to.equal(true);
  });
});
