/* eslint handle-callback-err: off, no-unused-expressions: off */
const mockRequire = require('mock-require');
const {Collection, EmittingPromise, FileCollection, ComponentCollection, File} = require('@frctl/support');
const {expect, sinon} = require('../../../../../test/helpers');
const makePlugin = require('../../test/helpers').makePlugin;
const Transformer = require('./transformer');
const PluginStore = require('./plugin-store');

const toFC = i => new FileCollection(i);
const toC = i => new Collection(i);
const toCC = i => new ComponentCollection(i);

const validPlugin = makePlugin('test-plugin');
const validPluginList = [
  makePlugin('test-plugin-1'),
  makePlugin('test-plugin-2', 'components'),
  makePlugin('test-plugin-3')
];
const invalidPlugin = {handler: i => i};

const validFCTransform = {
  name: 'valid-transform',
  passthru: true,
  transform: toFC
};
const validTransformWithPlugin = {
  name: 'valid-transform-with-plugin',
  passthru: true,
  transform: toC,
  plugins: validPlugin
};
const validTransformWithPluginAlt = {
  name: 'valid-transform-with-plugin-alt',
  passthru: true,
  transform: toC,
  plugins: {
    name: 'plugin-tested',
    collection: 'files',
    handler: items => items.map(i => Object.assign({}, i, {tested: true}))
  }
};
const transformWithInvalidPlugin = {
  name: 'valid-transform-with-invalid-plugin',
  passthru: true,
  transform: toFC,
  plugins: invalidPlugin
};
const transformWithInvalidPluginReturnValue = {
  name: 'valid-transform-with-invalid-return',
  passthru: true,
  transform: toFC,
  plugins: {
    name: 'plugin-invalid-return',
    collection: 'files',
    handler: items => items.reduce((i, prev) => Boolean(i && prev), true)
  }
};
const transformWithInvalidTransform1 = {
  name: 'transform-with-invalid-transform1',
  passthru: true,
  transform: () => ['ss'],
  plugins: validPlugin
};
const transformWithInvalidTransform2 = {
  name: 'transform-with-invalid-transform2',
  passthru: true,
  transform: function () {},
  plugins: validPlugin
};
const validTransformWithPlugins = {
  name: 'valid-transform-with-plugins',
  passthru: true,
  transform: toCC,
  plugins: validPluginList
};

let addSpy;

describe('Transformer', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const transformer = new Transformer(validFCTransform);
      expect(transformer instanceof Transformer).to.be.true;
    });
    it('validates its input', function () {
      expect(() => new Transformer(/* Empty */)).to.throw(TypeError, '[transform-invalid]');
      expect(() => new Transformer('Invalid string')).to.throw(TypeError, '[transform-invalid]');
      expect(() => new Transformer({name: 'transform without required props'})).to.throw(TypeError, '[transform-invalid]');
      expect(() => new Transformer(transformWithInvalidTransform1)).to.throw(TypeError, '[transform-function-invalid]');
      expect(() => new Transformer(transformWithInvalidTransform2)).to.throw(TypeError, '[transform-function-invalid]');
      expect(() => new Transformer(transformWithInvalidPlugin)).to.throw(TypeError, '[transform-invalid]');
      expect(() => new Transformer(validFCTransform)).to.not.throw();
      expect(() => new Transformer(validTransformWithPlugin)).to.not.throw();
      expect(() => new Transformer(validTransformWithPlugins)).to.not.throw();
    });
    it('assigns items passed to constructor correctly', function () {
      const transformer = new Transformer(validFCTransform);
      expect(transformer).to.be.a('Transformer').and.include.all.keys(['name', 'plugins', 'transform', 'passthru']);
      expect(transformer.name).to.equal('valid-transform');
      expect(transformer.plugins).to.be.a('PluginStore').and.have.property('items').that.has.property('length').that.equals(0);
      expect(transformer.transform).to.equal(toFC);
      expect(transformer.passthru).to.equal(true);
      expect(transformer.Collection).to.equal(FileCollection);
    });
  });

  describe('.addPlugin()', function () {
    before(function () {
      addSpy = sinon.spy(PluginStore.prototype, 'add');
      mockRequire.reRequire('./transformer');
    });
    beforeEach(function () {
      addSpy.reset();
    });
    it('returns a reference to itself', function () {
      const transformer = new Transformer(validFCTransform);
      expect(transformer.addPlugin(validPlugin)).to.equal(transformer);
    });
    it('defers to its Plugin.add() method', function () {
      const transformer = new Transformer(validFCTransform);
      expect(transformer.addPlugin(validPlugin)).to.equal(transformer);
      expect(addSpy.calledWith(validPlugin)).to.equal(true);
      addSpy.reset();
      expect(transformer.addPlugin(validPluginList)).to.equal(transformer);
      expect(addSpy.calledWith(validPluginList)).to.equal(true);
      addSpy.reset();
      expect(() => transformer.addPlugin(invalidPlugin)).to.throw(TypeError);
      expect(addSpy.calledWith(invalidPlugin)).to.equal(true);
    });
  });

  describe('.run()', function () {
    it('it returns an EmittingPromise', function () {
      const transformer = new Transformer(validFCTransform);
      const promise = transformer.run();
      expect(promise).to.be.a('Promise');
      expect(promise).to.be.an.instanceof(EmittingPromise);
      expect(promise.on).to.be.a('function');
    });

    it('it returns the expected result of its transform methods', async function () {
      const transformer = new Transformer(validFCTransform);
      const result = await transformer.run([new File(), new File()]);
      expect(result).to.be.a('FileCollection').that.has.a.property('length').that.equals(2);
    });

    it('it returns the expected result of its transform and plugin methods', async function () {
      const transformer = new Transformer(validTransformWithPluginAlt);
      const result = await transformer.run([{title: 'Red'}, {title: 'Blue'}]);
      expect(result).to.be.a('Collection').that.has.a.property('length').that.equals(2);
      expect(result.toArray()).to.eql([{title: 'Red', tested: true}, {title: 'Blue', tested: true}]);
    });

    it('it emits the expected events for transform', function () {
      const _transformer = new Transformer(validFCTransform);
      const task = _transformer.run([new File(), new File()]);
      task.on('transform.start', ({transformer}) => {
        expect(_transformer).to.eql(_transformer);
      });
      task.on('transform.complete', ({transformer, collection}) => {
        expect(_transformer).to.eql(_transformer);
        expect(collection).to.be.a('FileCollection').with.property('length').that.equals(2);
      });
      return task;
    });

    it('it emits the expected events for transform and plugins', function () {
      const _transformer = new Transformer(validTransformWithPluginAlt);
      const task = _transformer.run([{title: 'Red'}, {title: 'Blue'}]);
      task.on('transform.start', ({transformer}) => {
        expect(_transformer).to.eql(_transformer);
      });
      task.on('plugin.start', ({plugin, transformer}) => {
        expect(_transformer).to.eql(_transformer);
        expect(plugin).to.be.an('object');
      });
      task.on('plugin.complete', ({plugin, transformer}) => {
        expect(_transformer).to.eql(_transformer);
        expect(plugin).to.be.an('object');
      });
      task.on('transform.complete', ({transformer, collection}) => {
        expect(_transformer).to.eql(_transformer);
        expect(collection).to.be.a('FileCollection').with.property('length').that.equals(2);
      });

      return task;
    });
    it('throws an error if plugins return invalid types', function () {
      const task = new Transformer(transformWithInvalidPluginReturnValue)
        .run([new File(), new File()])
        .catch(err => {
          expect(err).to.be.an('Error').with.a.property('message').that.matches(/\[plugin-return-invalid\]/);
        });
      return task;
    });
  });

  describe('[Symbol.toStringTag]', function () {
    it('has the correct value', function () {
      const transformer = new Transformer(validFCTransform);
      expect(transformer[Symbol.toStringTag]).to.equal('Transformer');
      expect(transformer).to.be.a('Transformer');
    });
  });

  describe('.getCollection()', function () {
    it('wraps items in the correct constructor', function () {
      const transformer = Transformer.from(validTransformWithPlugins);
      let items = transformer.getCollection([]);
      expect(items).to.be.a('ComponentCollection');
      items = transformer.getCollection(new ComponentCollection());
      expect(items).to.be.a('ComponentCollection');
    });
  });

  describe('.from()', function () {
    it('returns a new instance', function () {
      const transformer = Transformer.from(validFCTransform);
      expect(transformer instanceof Transformer).to.be.true;
    });
    it('returns a new instance from an existing instance', function () {
      const transformer1 = Transformer.from(validFCTransform);
      const transformer2 = Transformer.from(transformer1);
      expect(transformer2 instanceof Transformer).to.be.true;
    });
  });
});
