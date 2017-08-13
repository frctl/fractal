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

function makeRenderer() {
  return new Renderer(new Fractal());
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
    });
  });

  describe('.render()', function () {
    it('returns a promise that resolves to a string', async function () {
      const renderer = makeRenderer();
      const result = renderer.render(funjucksFile);
      expect(result).to.be.instanceOf(Promise);
      expect(await result).to.be.a('string');
    });
  });

  describe('.renderView()', function () {
    it('returns a promise that resolves to a string', async function () {
      const renderer = makeRenderer();
      const result = renderer.renderView(funjucksFile);
      expect(result).to.be.instanceOf(Promise);
      expect(await result).to.be.a('string');
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
