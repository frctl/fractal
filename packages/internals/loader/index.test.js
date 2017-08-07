const {expect} = require('../../../test/helpers');
const Loader = require('./src/loader');
const main = require('.');

describe('main', function () {
  it('exports the loader class', function () {
    expect(main).to.equal(Loader);
  });
});
