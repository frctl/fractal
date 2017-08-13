const {File} = require('@frctl/support');
const {expect} = require('../../../../test/helpers');
const AdapterStore = require('./adapter-store');

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

describe.only('Renderer - AdapterStore', function () {
  describe('constructor', function () {
    it('adds adapters if provided', function () {
      const adapterStore = new AdapterStore(adapters);
      expect(adapterStore.adapters.length).to.equal(adapters.length);
    });
  });

  describe('.add()', function () {
    it('adds a single adapter', function () {
      const adapterStore = new AdapterStore();
      adapterStore.add(adapters[0]);
      expect(adapterStore.adapters.length).to.equal(1);
      expect(adapterStore.adapters[0].name).to.equal(adapters[0].name);
    });
    it('adds an array of adapters', function () {
      const adapterStore = new AdapterStore();
      adapterStore.add(adapters);
      expect(adapterStore.adapters.length).to.equal(adapters.length);
      expect(adapterStore.adapters[0].name).to.equal(adapters[0].name);
      expect(adapterStore.adapters[1].name).to.equal(adapters[1].name);
    });
    it('pushes adapters onto the end of the stack', function () {
      const adapterStore = new AdapterStore();
      adapterStore.add(adapters[0]);
      adapterStore.add(adapters[1]);
      expect(adapterStore.adapters[1].name).to.equal(adapters[1].name);
    });
    it('replaces previously added adapters that have the same name', async function () {
      const adapterStore = new AdapterStore();
      adapterStore.add(adapters);
      expect(adapterStore.adapters.length).to.equal(adapters.length);
      adapterStore.add({
        name: 'funjucks',
        match: '.foo',
        render() {
          return Promise.resolve('override');
        }
      });
      expect(adapterStore.adapters.length).to.equal(adapters.length);
      const adapter = adapterStore.adapters.find(adapter => adapter.name === 'funjucks');
      expect(await adapter.render(funjucksFile)).to.equal('override');
    });
  });

  describe('.getDefaultAdapter()', function () {
    it('returns the first adapter', function () {
      const adapterStore = new AdapterStore(adapters);
      expect(adapterStore.getDefaultAdapter().name).to.equal(adapters[0].name);
    });
  });

  describe('.getAdapterFor()', function () {
    it('returns the first adapter that matches the file provided', function () {
      const adapterStore = new AdapterStore(adapters);
      adapterStore.add({
        name: 'funjucks2',
        match: '.fjk',
        render: () => Promise.resolve('take 2')
      });
      expect(adapterStore.getAdapterFor(funjucksFile).name).to.equal(adapters[0].name);
    });
    it('returns undefined if no matching adapter can be found', function () {
      const adapterStore = new AdapterStore(adapters);
      expect(adapterStore.getAdapterFor(new File({path: 'foo.bar'}))).to.equal(undefined);
    });
    it('throws an error if a File instance is no provided', function () {
      const adapterStore = new AdapterStore(adapters);
      expect(() => adapterStore.getAdapterFor('foo')).to.throw('[file-invalid]');
      expect(() => adapterStore.getAdapterFor()).to.throw('[file-invalid]');
    });
  });

  describe('.adapters()', function () {
    it('returns the array of adapters', function () {
      const adapterStore = new AdapterStore(adapters);
      expect(adapterStore.adapters).to.be.an('array');
      expect(adapterStore.adapters.length).to.equal(adapters.length);
      expect(adapterStore.adapters[0].name).to.equal(adapters[0].name);
    });
  });
});
