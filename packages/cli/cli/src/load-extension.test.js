const {expect, sinon, mockRequire} = require('../../../../test/helpers');

describe('Cli - load-extension', function () {
  let spy;
  let loader;
  beforeEach(function () {
    spy = sinon.spy(() => {
      throw new Error('err');
    });
    mockRequire('import-cwd', spy);
    loader = mockRequire.reRequire('./load-extension');
  });
  afterEach(function () {
    mockRequire.stop('import-cwd');
    spy.reset();
  });
  it('exports a function', function () {
    expect(loader).to.be.a('function');
  });
  it('attempts to load a fractal-namespaced package first', function () {
    loader('foo');
    expect(spy.firstCall.args[0]).to.equal('@frctl/foo');
  });
  it('attempts to load the package directory second', function () {
    loader('foo');
    expect(spy.secondCall.args[0]).to.equal('foo');
  });
  it('skips the fractal-namespaced package if it\'s a local path', function () {
    loader('./foo');
    expect(spy.firstCall.args[0]).to.equal('./foo');
  });
  it('returns undefined if the package is not found', function () {
    expect(loader('foo')).to.equal(undefined);
  });
  it('throws an error if the loaded package is not a function', function () {
    mockRequire.stop('import-cwd');
    loader = mockRequire.reRequire('./load-extension');
    expect(() => loader('./package.json')).to.throw('[package-invalid]');
  });
  it('calls the resolved package function with any opts provided and returns the result', function () {
    mockRequire.stop('import-cwd');
    const extension = {};
    const opts = {};
    const pkgSpy = sinon.spy(() => extension);
    mockRequire('import-cwd', () => pkgSpy);
    loader = mockRequire.reRequire('./load-extension');
    const result = loader('./foobar', opts);
    expect(result).to.equal(extension);
    expect(pkgSpy.calledWith(opts)).to.equal(true);
  });
});
