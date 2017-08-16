const {File} = require('@frctl/support');
const {toArray} = require('@frctl/utils');
const {expect, sinon} = require('../../../../test/helpers');
// const parserOutput = require('../../../../test/fixtures/parser-result');
const Renderer = require('./renderer');

const adapters = [{
  name: 'funjucks',
  match: '.fjk',
  render: () => Promise.resolve('the rendered string')
}, {
  name: 'fwig',
  match: '.fig',
  render: () => Promise.resolve('the rendered string')
}];

const funjucksFile = new File({
  path: 'path/to/file.fjk'
});

function makeRenderer(adapter = []) {
  return new Renderer(toArray(adapter));
}

describe('Renderer', function () {
  describe('constructor', function () {
    it('adds adapters if provided', function () {
      const renderer = new Renderer();
      expect(renderer.adapters.length).to.equal(0);
      const renderer2 = new Renderer(adapters);
      expect(renderer2.adapters.length).to.equal(2);
    });
  });

  describe('.addAdapter()', function () {
    it('adds a single adapter', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters[0]);
      expect(renderer.adapters.length).to.equal(1);
      expect(renderer.adapters[0].name).to.equal(adapters[0].name);
    });
    it('adds an array of adapters', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters);
      expect(renderer.adapters.length).to.equal(adapters.length);
      expect(renderer.adapters[0].name).to.equal(adapters[0].name);
      expect(renderer.adapters[1].name).to.equal(adapters[1].name);
    });
    it('pushes adapters onto the end of the stack', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters[0]);
      renderer.addAdapter(adapters[1]);
      expect(renderer.adapters[1].name).to.equal(adapters[1].name);
    });
    it('replaces previously added adapters that have the same name', async function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters);
      expect(renderer.adapters.length).to.equal(adapters.length);
      renderer.addAdapter({
        name: 'funjucks',
        match: '.foo',
        render() {
          return Promise.resolve('override');
        }
      });
      expect(renderer.adapters.length).to.equal(adapters.length);
      const adapter = renderer.adapters.find(adapter => adapter.name === 'funjucks');
      expect(await adapter.render(funjucksFile)).to.equal('override');
    });
    it('returns the renderer instance', function () {
      const renderer = makeRenderer();
      expect(renderer.addAdapter(adapters)).to.equal(renderer);
    });
  });

  describe('.getDefaultAdapter()', function () {
    it('returns the first adapter', function () {
      const renderer = makeRenderer(adapters);
      expect(renderer.getDefaultAdapter().name).to.equal(adapters[0].name);
    });
  });

  describe('.getAdapterFor()', function () {
    it('returns the first adapter that matches the file provided', function () {
      const renderer = makeRenderer(adapters);
      renderer.addAdapter({
        name: 'funjucks2',
        match: '.fjk',
        render: () => Promise.resolve('take 2')
      });
      expect(renderer.getAdapterFor(funjucksFile).name).to.equal(adapters[0].name);
    });
    it('returns undefined if no matching adapter can be found', function () {
      const renderer = makeRenderer(adapters);
      expect(renderer.getAdapterFor(new File({path: 'foo.bar'}))).to.equal(undefined);
    });
    it('throws an error if a File instance is no provided', function () {
      const renderer = makeRenderer(adapters);
      expect(() => renderer.getAdapterFor('foo')).to.throw('[file-invalid]');
      expect(() => renderer.getAdapterFor()).to.throw('[file-invalid]');
    });
  });

  describe('.render()', function () {
    it('returns a promise that resolves to a string', async function () {
      const renderer = makeRenderer(adapters);
      const result = renderer.render(funjucksFile);
      expect(result).to.be.instanceOf(Promise);
      expect(await result).to.be.a('string');
    });
    it('calls the adapter render method with the expected arguments', async function () {
      const renderSpy = sinon.spy(adapters[0], 'render');
      const renderer = new Renderer();
      const opts = {};
      const context = {};
      const collections = {};
      renderer.addAdapter(adapters);
      const result = await renderer.render(funjucksFile, context, collections, opts);
      expect(renderSpy.calledWith(funjucksFile, context, collections, opts)).to.equal(true);
      expect(result).to.equal(await adapters[0].render(funjucksFile, context, collections, opts));
      renderSpy.restore();
    });
    it('rejects if no matching adapter can be found', function () {
      return expect(makeRenderer().render(funjucksFile)).to.be.rejectedWith('[adapter-not-found]');
    });
    it('rejects if the file is not a File instance', function () {
      return expect(makeRenderer(adapters).render({foo: 'bar'})).to.be.rejectedWith('[file-invalid]');
    });
    it('rejects if no file is provided', function () {
      return expect(makeRenderer(adapters).render()).to.be.rejectedWith('[file-invalid]');
    });
    it('rejects if invalid context is supplied', function () {
      return expect(makeRenderer(adapters).render(funjucksFile, 'foo')).to.be.rejectedWith('[context-invalid]');
    });
    it('rejects if and invalid collections object is supplied', function () {
      return expect(makeRenderer(adapters).render(funjucksFile, {}, 'foo')).to.be.rejectedWith('[collections-invalid]');
    });
    it('rejects if invalid options are supplied', function () {
      return expect(makeRenderer(adapters).render(funjucksFile, {}, {}, 'foo')).to.be.rejectedWith('[opts-invalid]');
    });
  });

  describe('.adapters', function () {
    it('returns the array of adapters', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapters[0]);
      expect(renderer.adapters).to.be.an('array');
      expect(renderer.adapters.length).to.equal(1);
      expect(renderer.adapters[0].name).to.equal(adapters[0].name);
    });
  });
});
