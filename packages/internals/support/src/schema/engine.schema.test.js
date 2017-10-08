const {expect, validateSchema} = require('../../../../../test/helpers');
const engineSchema = require('./engine.schema');

describe('Adapter schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(engineSchema)).to.equal(true);
  });
});
