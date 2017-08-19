const {expect} = require('../../../../test/helpers');
const loader = require('./load-extension');

describe('Cli - load-extension', function () {
  it('exports a function', function () {
    expect(loader).to.be.a('function');
  });
});
