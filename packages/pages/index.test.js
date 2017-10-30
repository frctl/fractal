const {expect} = require('../../test/helpers');
const main = require('.');

describe('Main export', function () {
  it('is a function', function () {
    expect(main).to.be.a('function');
  });
  it('returns an object with the expected properties', function () {
    const extension = main();
    expect(extension).to.have.property('name').that.equals('pages');
    expect(extension).to.have.property('commands').that.is.an('array').and.has.property('length').that.equals(1);
  });
});
