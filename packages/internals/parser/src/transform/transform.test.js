/* eslint handle-callback-err: off, no-unused-expressions: off */
const mockRequire = require('mock-require');
const {EventEmitter2} = require('eventemitter2');
const {Collection, FileCollection, ComponentCollection, File} = require('@frctl/support');
const {expect, sinon, validateSchema} = require('../../../../../test/helpers');
const makePlugin = require('../../test/helpers').makePlugin;
const Transform = require('./transform');
const transformSchema = require('./transform.schema');
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

describe('Transform', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const transform = new Transform(validFCTransform);
      expect(transform instanceof Transform).to.be.true;
    });
    it('validates its input', function () {
      expect(() => new Transform(/* Empty */)).to.throw(TypeError, '[invalid-properties]');
      expect(() => new Transform('Invalid string')).to.throw(TypeError, '[invalid-properties]');
      expect(() => new Transform({name: 'transform without required props'})).to.throw(TypeError, '[invalid-properties]');
      expect(() => new Transform(transformWithInvalidTransform1)).to.throw(TypeError, '[transform-function-invalid]');
      expect(() => new Transform(transformWithInvalidTransform2)).to.throw(TypeError, '[transform-function-invalid]');
      expect(() => new Transform(transformWithInvalidPlugin)).to.throw(TypeError, '[invalid-properties]');
      expect(() => new Transform(validFCTransform)).to.not.throw();
      expect(() => new Transform(validTransformWithPlugin)).to.not.throw();
      expect(() => new Transform(validTransformWithPlugins)).to.not.throw();
    });
    it('assigns items passed to constructor correctly', function () {
      const transform = new Transform(validFCTransform);
      expect(transform).to.be.a('Transform').and.include.all.keys(['name', 'plugins', 'transform', 'passthru']);
      expect(transform.name).to.equal('valid-transform');
      expect(transform.plugins).to.be.a('PluginStore').and.have.property('items').that.has.property('length').that.equals(0);
      expect(transform.transform).to.equal(toFC);
      expect(transform.passthru).to.equal(true);
      expect(transform.Collection).to.equal(FileCollection);
    });
  });

  describe('.addPlugin()', function () {
    before(function () {
      addSpy = sinon.spy(PluginStore.prototype, 'add');
      mockRequire.reRequire('./transform');
    });
    beforeEach(function () {
      addSpy.reset();
    });
    it('returns a reference to itself', function () {
      const transform = new Transform(validFCTransform);
      expect(transform.addPlugin(validPlugin)).to.equal(transform);
    });
    it('defers to its Plugin.add() method', function () {
      const transform = new Transform(validFCTransform);
      expect(transform.addPlugin(validPlugin)).to.equal(transform);
      expect(addSpy.calledWith(validPlugin)).to.equal(true);
      addSpy.reset();
      expect(transform.addPlugin(validPluginList)).to.equal(transform);
      expect(addSpy.calledWith(validPluginList)).to.equal(true);
      addSpy.reset();
      expect(() => transform.addPlugin(invalidPlugin)).to.throw(TypeError);
      expect(addSpy.calledWith(invalidPlugin)).to.equal(true);
    });
    it('passes config options on to its PluginStore', function () {
      const transformDefinition = {
        name: 'valid-transform-with-default-plugin-collection',
        passthru: true,
        transform: toCC,
        plugins: validPluginList,
        pluginOptions: {
          defaultCollection: 'components'
        }
      };
      const transform = new Transform(transformDefinition);
      expect(transform).to.have.a.property('plugins')
      .that.has.a.property('options')
      .that.has.a.property('defaultCollection')
      .that.equals('components');

      const transformNotSet = new Transform({name: 'transform-not-set', transform: i => i});
      expect(transformNotSet).to.have.a.property('plugins')
      .that.has.a.property('options')
      .that.has.a.property('defaultCollection')
      .that.equals('files');
    });
  });

  describe('.run()', function () {
    it('it returns a Promise', function () {
      const transform = new Transform(validFCTransform);
      const promise = transform.run();
      expect(promise).to.be.a('Promise');
    });

    it('it returns the expected result of its transform methods', async function () {
      const transform = new Transform(validFCTransform);
      const result = await transform.run([new File(), new File()]);
      expect(result).to.be.a('FileCollection').that.has.a.property('length').that.equals(2);
    });

    it('it returns the expected result of its transform and plugin methods', async function () {
      const transform = new Transform(validTransformWithPluginAlt);
      const result = await transform.run([{title: 'Red'}, {title: 'Blue'}]);
      expect(result).to.be.a('Collection').that.has.a.property('length').that.equals(2);
      expect(result.toArray()).to.eql([{title: 'Red', tested: true}, {title: 'Blue', tested: true}]);
    });

    it('it emits the expected events for transform when an emitter is provided', async function () {
      const _transform = new Transform(validFCTransform);
      const emitter = new EventEmitter2();

      emitter.on('transform.start', ({transform}) => {
        expect(_transform).to.eql(transform);
      });
      emitter.on('transform.complete', ({transform, collection}) => {
        expect(_transform).to.eql(transform);
        expect(collection).to.be.a('FileCollection').with.property('length').that.equals(3);
      });
      const emittedSpy = sinon.spy(emitter, 'emit');

      await _transform.run([new File(), new File(), new File()], {}, {}, emitter);
      expect(emittedSpy.callCount).to.equal(2);
    });

    it('it emits the expected events for transform and plugins', async function () {
      const _transform = new Transform(validTransformWithPluginAlt);
      const emitter = new EventEmitter2();

      emitter.on('transform.start', ({transform}) => {
        expect(_transform).to.eql(transform);
      });
      emitter.on('plugin.start', ({plugin, transform}) => {
        expect(_transform).to.eql(transform);
        expect(plugin).to.be.a('Plugin');
      });
      emitter.on('plugin.complete', ({plugin, transform}) => {
        expect(_transform).to.eql(transform);
        expect(plugin).to.be.a('Plugin');
      });
      emitter.on('transform.complete', ({transform, collection}) => {
        expect(_transform).to.eql(transform);
        expect(collection).to.be.a('Collection').with.property('length').that.equals(2);
      });
      const emittedSpy = sinon.spy(emitter, 'emit');
      await _transform.run([{title: 'Red'}, {title: 'Blue'}], {}, {}, emitter);
      expect(emittedSpy.callCount).to.equal(4);
    });
    it('throws an error if plugins return invalid types', function () {
      const task = new Transform(transformWithInvalidPluginReturnValue)
        .run([new File(), new File()])
        .catch(err => {
          expect(err).to.be.an('Error').with.a.property('message').that.matches(/\[plugin-return-invalid\]/);
        });
      return task;
    });
  });

  describe('[Symbol.toStringTag]', function () {
    it('has the correct value', function () {
      const transform = new Transform(validFCTransform);
      expect(transform[Symbol.toStringTag]).to.equal('Transform');
      expect(transform).to.be.a('Transform');
    });
  });

  describe('.getCollection()', function () {
    it('wraps items in the correct constructor', function () {
      const transform = Transform.from(validTransformWithPlugins);
      let items = transform.getCollection([]);
      expect(items).to.be.a('ComponentCollection');
      items = transform.getCollection(new ComponentCollection());
      expect(items).to.be.a('ComponentCollection');
    });
  });

  describe('.from()', function () {
    it('returns a new instance', function () {
      const transform = Transform.from(validFCTransform);
      expect(transform instanceof Transform).to.be.true;
    });
    it('returns a new instance from an existing instance', function () {
      const transform1 = Transform.from(validFCTransform);
      const transform2 = Transform.from(transform1);
      expect(transform2 instanceof Transform).to.be.true;
    });
  });

  describe('Transform schema', function () {
    it('is a valid schema', function () {
      expect(validateSchema(transformSchema)).to.equal(true);
    });
  });
});
