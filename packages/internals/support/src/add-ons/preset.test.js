const {expect, validateSchema} = require('../../../../../test/helpers');
const presetSchema = require('./preset.schema');

describe('Preset schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(presetSchema)).to.equal(true);
  });
});
