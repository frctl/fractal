const {expect} = require('../../../../../test/helpers');
const loadPkgs = require('./packages-loader');

// const packages = [() => ({}), () => ({}), () => ({})];

describe('packages-loader', function () {
  it('exports a function', function () {
    expect(loadPkgs).to.be.a('function');
  });

  it('returns an array', function () {
    expect(loadPkgs([])).to.be.an('array');
  });

  it('calls the package-loader accessor for each item in the array');
});
