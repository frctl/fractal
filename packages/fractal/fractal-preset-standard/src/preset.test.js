const schema = require('@frctl/support/schema');
const {expect, validate} = require('../../../../test/helpers');
const preset = require('./preset');

describe('preset-core', function () {
  it('has the expected format', function () {
    expect(validate(schema.preset, preset())).to.equal(true);
  });
});
