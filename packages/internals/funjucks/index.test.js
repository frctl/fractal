const {expect} = require('../../../test/helpers');
const factory = require('./src/env');
const main = require('.');

describe('main', function () {
  it('exports the environment factory', function () {
    expect(main).to.equal(factory);
  });
});
