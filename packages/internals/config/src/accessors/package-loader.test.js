const {expect, sinon} = require('../../../../../test/helpers');
const loadPkg = require('./package-loader');

describe('package-loader', function () {
  it('exports a function', function () {
    expect(loadPkg).to.be.a('function');
  });

  it('does nothing if called with an object target', function () {
    const pkg = {};
    expect(loadPkg(pkg)).to.equal(pkg);
  });

  it('loads packages from the cwd if the target is a path or an array with a path as it\'s first item', function () {
    const pkg = loadPkg('./test/fixtures/add-ons/plugin');
    expect(pkg).to.be.an('object');
    expect(pkg).to.have.property('name');

    const pkg2 = loadPkg(['./test/fixtures/add-ons/plugin']);
    expect(pkg2).to.be.an('object');
    expect(pkg2).to.have.property('name');
  });

  it('throws an error if a package is not found', function () {
    expect(() => loadPkg('./not/found')).to.throw();
    expect(() => loadPkg(['./not/found'])).to.throw();
  });

  it('throws an error if the package does not resolve to a function or object', function () {
    expect(() => loadPkg(null)).to.throw(TypeError, '[package-invalid]');
    expect(() => loadPkg([null])).to.throw(TypeError, '[package-invalid]');
    expect(() => loadPkg(123)).to.throw(TypeError, '[package-invalid]');
    expect(() => loadPkg({})).to.not.throw(TypeError, '[package-invalid]');
  });

  it('can pass options to the package when supplied via an array-style target', function () {
    const opts = {};
    const pkg = () => ({});
    const spy = sinon.spy(pkg);
    loadPkg([spy, opts]);
    expect(spy.calledOnce).to.equal(true);
    expect(spy.calledWith(opts)).to.equal(true);
  });
});
