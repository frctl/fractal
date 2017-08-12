const {expect, validate} = require('../../../../test/helpers');
const presetSchema = require('../../../../test/schema/preset');
const preset = require('./preset');

describe('preset-core', function () {
  it('has the expected format', function () {
    expect(validate(presetSchema, preset())).to.equal(true);
  });
});
