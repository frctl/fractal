/* eslint handle-callback-err: off, no-unused-expressions: off */
var mockRequire = require('mock-require');
const {Emitter, Collection, FileCollection, ComponentCollection, File} = require('@frctl/support');
const {expect, sinon} = require('../../../../../test/helpers');
const makePlugin = require('../../test/helpers').makePlugin;
const Transformer = require('./transformer');
const Plugins = require('./plugins');

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
    handler: items => items.map(i => Object.assign({}, i, { tested: true}))
  }
};
const transformWithInvalidPlugin = {
  name: 'valid-transform-with-invalid-plugin',
  passthru: true,
  transform: toFC,
  plugins: invalidPlugin
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

describe.only('Transformer', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const transformer = new Transformer(validFCTransform);
      expect(transformer instanceof Transformer).to.be.true;
      expect(transformer instanceof Emitter).to.be.true;
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
      expect(transformer.plugins).to.be.a('Plugins').and.have.property('items').that.has.property('length').that.equals(0);
      expect(transformer.transform).to.equal(toFC);
      expect(transformer.passthru).to.equal(true);
      expect(transformer.Collection).to.equal(FileCollection);
    });
  });

  describe('.addPlugin()', function () {
    before(function () {
      addSpy = sinon.spy(Plugins.prototype, 'add');
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
    it('it returns a Promise', function () {
      const transformer = new Transformer(validFCTransform);
      const promise = transformer.run();
      expect(promise).to.be.a('Promise');
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
      expect(result.toArray()).to.eql([{title: 'Red', tested: true}, {title: 'Blue', tested: true}])
    });

    it('it emits the expected events for transform', async function () {
      const transformer = new Transformer(validFCTransform);
      const emitSpy = sinon.spy(transformer, 'emit');
      await transformer.run([new File(), new File()]);
      expect(emitSpy.calledTwice).to.be.true;
      expect(emitSpy.args[0][0]).to.equal('transform.start');
      expect(emitSpy.args[1][0]).to.equal('transform.complete');
    });

    it('it emits the expected events for transform and plugins', async function () {
      const transformer = new Transformer(validTransformWithPluginAlt);
      const emitSpy = sinon.spy(transformer, 'emit');
      await transformer.run([{title: 'Red'}, {title: 'Blue'}]);
      expect(emitSpy.callCount).to.equal(4);
      expect(emitSpy.args[0][0]).to.equal('transform.start');
      expect(emitSpy.args[1][0]).to.equal('plugin.start');
      expect(emitSpy.args[2][0]).to.equal('plugin.complete');
      expect(emitSpy.args[3][0]).to.equal('transform.complete');
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
      expect(transformer instanceof Emitter).to.be.true;
    });
  });
});
