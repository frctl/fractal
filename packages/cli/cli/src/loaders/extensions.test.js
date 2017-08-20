const {expect, sinon, mockRequire} = require('../../../../../test/helpers');

describe('Cli - load-extension', function () {
  let spy;
  let loader;
  beforeEach(function () {
    spy = sinon.spy(() => {
      throw new Error('err');
    });
    mockRequire('import-cwd', spy);
    loader = mockRequire.reRequire('./extensions');
  });
  afterEach(function () {
    mockRequire.stop('import-cwd');
    spy.reset();
  });
  it('exports a function', function () {
    expect(loader).to.be.a('function');
  });
  it('returns an array', function () {
    expect(loader({})).to.be.an('array');
  });
  it('attempts to load a fractal-namespaced packages first', function () {
    loader({foo: true});
    expect(spy.firstCall.args[0]).to.equal('@frctl/foo');
  });
  it('attempts to load the package directories second', function () {
    loader({foo: true});
    expect(spy.secondCall.args[0]).to.equal('foo');
  });
  it('skips the fractal-namespaced packages if it\'s a local path', function () {
    loader({'./foo': true});
    expect(spy.firstCall.args[0]).to.equal('./foo');
  });
  it('silently skips packages that can\'t be found', function () {
    expect(loader({foo: true})).to.eql([]);
  });
  it('throws an error if the loaded package is not a function', function () {
    mockRequire.stop('import-cwd');
    loader = mockRequire.reRequire('./extensions');
    expect(() => loader({'./package.json': true})).to.throw('[package-invalid]');
  });
  it('calls the resolved package functions with any opts provided and returns the result', function () {
    mockRequire.stop('import-cwd');
    const extension = {};
    const opts = {};
    const pkgSpy = sinon.spy(() => extension);
    mockRequire('import-cwd', () => pkgSpy);
    loader = mockRequire.reRequire('./extensions');
    const result = loader({'./foobar': opts});
    expect(result[0]).to.equal(extension);
    expect(pkgSpy.calledWith(opts)).to.equal(true);
  });
});
