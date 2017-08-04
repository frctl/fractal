const {expect} = require('../../../../../test/helpers');
const pkg = require('./package');

describe('package', function () {
  it('exports a function', function () {
    expect(pkg).to.be.a('function');
  });

});
