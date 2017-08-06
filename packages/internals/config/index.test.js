const {expect} = require('../../../test/helpers');
const Config = require('./src/config');
const main = require('.');

describe('main exports', function () {
  it('exports the Config class', function () {
    expect(main).to.equal(Config);
  });
});
