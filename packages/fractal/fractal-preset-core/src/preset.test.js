const {Preset} = require('@frctl/support');
const {expect, validate} = require('../../../../test/helpers');
const preset = require('./preset');

describe('preset-core', function () {
  it('has the expected format', function () {
    expect(validate(Preset.schema, preset())).to.equal(true);
  });
});
