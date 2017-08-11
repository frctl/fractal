const {expect, validateSchema} = require('../../../../../test/helpers');
const configSchema = require('./schema');

describe('Fractal config schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(configSchema)).to.equal(true);
  });
});
