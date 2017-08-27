const proxyquire = require('proxyquire');
const {expect, sinon} = require('../../../../../test/helpers');
const loader = require('./extensions');

describe('CLI extension loader', function () {
  it('exports a function', function () {
    expect(loader).to.be.a('function');
  });
  it('returns an array', function () {
    expect(loader({})).to.be.an('array');
  });
  it('attempts to load a fractal-namespaced packages first', function () {
    const spy = sinon.spy();
    const loader = proxyquire('./extensions', {
      'import-cwd': spy
    });
    loader({foo: true});
    expect(spy.firstCall.args[0]).to.equal('@frctl/foo');
  });
  it('attempts to load the package directories second', function () {
    const spy = sinon.spy();
    const loader = proxyquire('./extensions', {
      'import-cwd': function (...args) {
        spy(...args);
        throw new Error('oops');
      }
    });
    loader({foo: true});
    expect(spy.secondCall.args[0]).to.equal('foo');
  });
  it('skips the fractal-namespaced packages if it\'s a local path', function () {
    const spy = sinon.spy();
    const loader = proxyquire('./extensions', {
      'import-cwd': spy
    });
    loader({'./foo': true});
    expect(spy.firstCall.args[0]).to.equal('./foo');
  });
  it('silently skips packages that can\'t be found', function () {
    expect(loader({foo: true})).to.eql([]);
  });
  it('throws an error if the loaded package is not a function', function () {
    expect(() => loader({'./package.json': true})).to.throw('[package-invalid]');
  });
  it('calls the resolved package functions with any opts provided and returns the result', function () {
    const extension = {};
    const opts = {};
    const pkgSpy = sinon.spy(() => extension);
    const loader = proxyquire('./extensions', {
      'import-cwd': function () {
        return pkgSpy;
      }
    });
    const result = loader({'./foobar': opts});
    expect(result[0]).to.equal(extension);
    expect(pkgSpy.calledWith(opts)).to.equal(true);
  });
});
