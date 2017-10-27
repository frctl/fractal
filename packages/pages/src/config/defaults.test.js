const {expect, validate} = require('../../../../test/helpers');
const defaults = require('./defaults');
const configSchema = require('./schema');

describe('Pages default config', function () {
  it('validates against the config schema', function () {
    expect(validate(configSchema, defaults)).to.equal(true);
  });
});
