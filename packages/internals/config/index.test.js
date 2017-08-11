const {expect} = require('../../../test/helpers');
const Config = require('./src/config');
const ExtendedConfig = require('./src/extended-config');
const main = require('.');

describe('config main', function () {
  it('exports the Config class as .Config', function () {
    expect(main.Config).to.equal(Config);
  });
  it('exports the ExtendedConfig class as .ExtendedConfig', function () {
    expect(main.ExtendedConfig).to.equal(ExtendedConfig);
  });
});
