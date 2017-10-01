const {toArray} = require('@frctl/utils');
const {expect} = require('../../../../test/helpers');
const Engine = require('./engine');
const EngineStore = require('./engine-store');

const engines = [{
  name: 'funjucks',
  match: '.fjk',
  render: () => Promise.resolve('the rendered string')
}, {
  name: 'fwig',
  match: '.fig',
  render: () => Promise.resolve('the rendered string')
}];

function makeEngineStore(engine = []) {
  return new EngineStore(toArray(engine));
}

describe('EngineStore', function () {
  describe('constructor', function () {
    it('adds engines if provided', function () {
      const store = new EngineStore();
      expect(store.engines.length).to.equal(0);
      const store2 = new EngineStore(engines);
      expect(store2.engines.length).to.equal(2);
    });
  });

  describe('.addEngine()', function () {
    it('adds a single engine', function () {
      const store = makeEngineStore();
      store.addEngine(engines[0]);
      expect(store.engines.length).to.equal(1);
      expect(store.engines[0].name).to.equal(engines[0].name);
    });
    it('adds an array of engines', function () {
      const store = makeEngineStore();
      store.addEngine(engines);
      expect(store.engines.length).to.equal(engines.length);
      expect(store.engines[0].name).to.equal(engines[0].name);
      expect(store.engines[1].name).to.equal(engines[1].name);
    });
    it('wraps all engine objects in Engine instances', function () {
      const store = makeEngineStore();
      store.addEngine(engines);
      for (const engine of store.engines) {
        expect(engine).to.be.instanceOf(Engine);
      }
    });
    it('pushes engines onto the end of the stack', function () {
      const store = makeEngineStore();
      store.addEngine(engines[0]);
      store.addEngine(engines[1]);
      expect(store.engines[1].name).to.equal(engines[1].name);
    });
    it('replaces previously added engines that have the same name', async function () {
      const store = makeEngineStore();
      store.addEngine(engines);
      expect(store.engines.length).to.equal(engines.length);
      store.addEngine({
        name: 'funjucks',
        match: '.foo',
        render() {
          return Promise.resolve('override');
        }
      });
      expect(store.engines.length).to.equal(engines.length);
      const engine = store.engines.find(engine => engine.name === 'funjucks');
      expect(await engine.render('foo')).to.equal('override');
    });
    it('returns the store instance', function () {
      const store = makeEngineStore();
      expect(store.addEngine(engines)).to.equal(store);
    });
  });

  describe('.getEngine()', function () {
    it('finds an engine by name', function () {
      const store = makeEngineStore(engines);
      expect(store.getEngine('funjucks')).to.be.instanceOf(Engine);
      expect(store.getEngine('funjucks').name).to.equal('funjucks');
    });
  });

  describe('.getEngineFor()', function () {
    it('returns the first engine that matches the file provided', function () {
      const store = makeEngineStore(engines);
      store.addEngine({
        name: 'funjucks2',
        match: '.fjk',
        render: () => Promise.resolve('take 2')
      });
      expect(store.getEngineFor('foo.fjk').name).to.equal(engines[0].name);
    });
    it('returns undefined if no matching engine can be found', function () {
      const store = makeEngineStore(engines);
      expect(store.getEngineFor('foo.bar')).to.equal(undefined);
    });
    it('throws an error if a File instance or path is not provided', function () {
      const store = makeEngineStore(engines);
      expect(() => store.getEngineFor({})).to.throw('[matcher-invalid]');
      expect(() => store.getEngineFor()).to.throw('[matcher-invalid]');
    });
  });

  describe('.engines', function () {
    it('returns the array of engines', function () {
      const store = makeEngineStore();
      store.addEngine(engines[0]);
      expect(store.engines).to.be.an('array');
      expect(store.engines.length).to.equal(1);
      expect(store.engines[0].name).to.equal(engines[0].name);
    });
  });
});
