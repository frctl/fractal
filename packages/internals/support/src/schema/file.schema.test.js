const {expect, validateSchema} = require('../../../../../test/helpers');
const fileSchema = require('./file.schema');

describe('File schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(fileSchema)).to.equal(true);
  });
});
