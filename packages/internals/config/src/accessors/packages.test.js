const {expect, sinon, mockRequire} = require('../../../../../test/helpers');
const packages = [() => ({}), () => ({}), () => ({})];

const spy = sinon.spy(val => val);
mockRequire('./package', spy);

const resolvePkgs = require('./packages');

describe('packages', function () {

  beforeEach(function(){
    spy.reset();
  });

  it('exports a function', function () {
    expect(resolvePkgs).to.be.a('function');
  });

  it('returns an array', function () {
    expect(resolvePkgs([])).to.be.an('array');
  });

  it('calls the package accessor for each item in the array', function () {
    const result = resolvePkgs(packages);
    expect(spy.called).to.equal(3);
  });
});
