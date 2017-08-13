const {File, Component, Variant} = require('@frctl/support');
const {Fractal} = require('@frctl/fractal');
const {expect, sinon} = require('../../../../test/helpers');
const Renderer = require('./renderer');
const AdapterStore = require('./adapter-store');

const adapter = {
  name: 'funjucks',
  match: '.fjk',
  render: () => Promise.resolve('the rendered string')
};

const funjucksFile = new File({
  path: 'path/to/file.fjk'
});

const componentDir = new File({
  path: 'path/to/component'
});

const component = new Component({
  src: componentDir
});

const variant = new Variant();

function makeRenderer(adapter) {
  const renderer = new Renderer(new Fractal());
  if (adapter) {
    renderer.addAdapter(adapter);
  }
  return renderer;
}

describe('Renderer', function () {
  describe('constructor', function () {
    it('throws an error if no Fractal instance is provided', function () {
      expect(() => new Renderer('fractal')).to.throw('[fractal-required]');
      expect(() => makeRenderer()).to.not.throw('[fractal-required]');
    });
  });

  describe('.addAdapter()', function () {
    it('adds adapters to the adapter store', function () {
      const renderer = makeRenderer();
      const spy = sinon.spy(renderer.adapterStore, 'add');
      renderer.addAdapter(adapter);
      expect(spy.calledWith(adapter)).to.equal(true);
      spy.restore();
    });
    it('returns the renderer instance', function () {
      const renderer = makeRenderer();
      const result = renderer.addAdapter(adapter);
      expect(result).to.equal(renderer);
    });
  });

  describe('.getAdapterFor()', function () {
    it('gets the matching file adapter from the adapter store', function () {
      const renderer = makeRenderer();
      const spy = sinon.spy(renderer.adapterStore, 'getAdapterFor');
      renderer.addAdapter(adapter);
      const fkj = renderer.getAdapterFor(funjucksFile);
      expect(spy.calledWith(funjucksFile)).to.equal(true);
      expect(fkj.name).to.equal('funjucks');
      spy.restore();
    });
  });

  describe('.getDefaultAdapter()', function () {
    it('gets the default adapter from the adapter store', function () {
      const renderer = makeRenderer();
      const spy = sinon.spy(renderer.adapterStore, 'getDefaultAdapter');
      renderer.addAdapter(adapter);
      const fkj = renderer.getDefaultAdapter();
      expect(spy.called).to.equal(true);
      expect(fkj.name).to.equal('funjucks');
      spy.restore();
    });
  });

  describe('.render()', function () {
    it('rejects if the target type is not supported', function () {
      return expect(makeRenderer(adapter).render({foo: 'bar'})).to.be.rejectedWith('[target-type-unknown]');
    });
    it('returns a promise that resolves to a string', async function () {
      const renderer = makeRenderer(adapter);
      const result = renderer.render(funjucksFile);
      expect(result).to.be.instanceOf(Promise);
      expect(await result).to.be.a('string');
    });
  });

  describe('.renderView()', function () {
    it('returns a promise that resolves to a string', async function () {
      const renderer = makeRenderer(adapter);
      const result = renderer.renderView(funjucksFile);
      expect(result).to.be.instanceOf(Promise);
      expect(await result).to.be.a('string');
    });
    it('calls the adapter render method with the expected arguments', async function () {
      const renderSpy = sinon.spy(adapter, 'render');
      const fractal = new Fractal();
      const renderer = new Renderer(fractal);
      const context = {};
      const opts = {};
      const collections = await fractal.parse();
      renderer.addAdapter(adapter);
      const result = await renderer.renderView(funjucksFile, context, opts);
      expect(renderSpy.calledWith(funjucksFile, context, opts, collections, fractal)).to.equal(true);
      expect(result).to.equal(await adapter.render(funjucksFile, context, opts, collections, fractal));
      renderSpy.restore();
    });
    it('rejects if no matching adapter can be found', function () {
      return expect(makeRenderer().renderView(funjucksFile)).to.be.rejectedWith('[adapter-not-found]');
    });
    it('rejects if the file is not a File instance', function () {
      return expect(makeRenderer(adapter).renderView({foo: 'bar'})).to.be.rejectedWith('[file-invalid]');
    });
    it('rejects if no file is provided', function () {
      return expect(makeRenderer(adapter).renderView()).to.be.rejectedWith('[file-invalid]');
    });
    it('rejects if invalid context is supplied', function () {
      return expect(makeRenderer(adapter).renderView(funjucksFile, 'foo')).to.be.rejectedWith('[context-invalid]');
    });
    it('rejects if invalid options are supplied', function () {
      return expect(makeRenderer(adapter).renderView(funjucksFile, {}, 'foo')).to.be.rejectedWith('[opts-invalid]');
    });
  });

  describe('.renderVariant()', function () {
    it('returns a promise that resolves to a string', async function () {
      const renderer = makeRenderer();
      const result = renderer.renderVariant(variant);
      expect(result).to.be.instanceOf(Promise);
      expect(await result).to.be.a('string');
    });
  });

  describe('.renderComponent()', function () {
    it('returns a promise that resolves to a string', async function () {
      const renderer = makeRenderer();
      const result = renderer.renderComponent(component);
      expect(result).to.be.instanceOf(Promise);
      expect(await result).to.be.a('string');
    });
  });

  describe('.adapters', function () {
    it('returns the array of adapters', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapter);
      expect(renderer.adapters).to.be.an('array');
      expect(renderer.adapters.length).to.equal(1);
      expect(renderer.adapters[0].name).to.equal(adapter.name);
    });
  });

  describe('.adapterStore', function () {
    it('returns the adapter store instance', function () {
      const renderer = makeRenderer();
      renderer.addAdapter(adapter);
      expect(renderer.adapterStore).to.be.instanceOf(AdapterStore);
    });
  });
});
