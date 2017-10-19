const {expect, validateSchema} = require('../../../../../test/helpers');
const pageSchema = require('./page.schema');

describe('Page schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(pageSchema)).to.equal(true);
  });
});
