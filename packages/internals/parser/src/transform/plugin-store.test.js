/* eslint handle-callback-err: off, no-unused-expressions: off */

const {expect, validateSchema} = require('../../../../../test/helpers');
const {validPlugin, validPluginList, invalidPlugin} = require('../../test/helpers');
const PluginStore = require('./plugin-store');
const pluginStoreSchema = require('./plugin-store.schema');

describe('Plugins', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const plugins = new PluginStore();
      expect(plugins instanceof PluginStore).to.be.true;
      expect(plugins).to.have.a.property('items');
    });
    it('adds items passed to constructor correctly', function () {
      let plugins = new PluginStore(validPlugin);
      expect(plugins).to.have.a.property('items').that.has.a.property('length').that.equals(1);
      plugins = new PluginStore(validPluginList);
      expect(plugins).to.have.a.property('items').that.has.a.property('length').that.equals(3);
    });
    it('throws a TypeError if invalid items are passed in', function () {
      expect(() => new PluginStore('wkahsd')).to.throw(TypeError, '[plugins-invalid]');
      expect(() => new PluginStore(invalidPlugin)).to.throw(TypeError, '[plugins-invalid]');
      expect(() => new PluginStore([validPlugin, invalidPlugin])).to.throw(TypeError, '[plugins-invalid]');
    });
  });
  describe('.add()', function () {
    it('adds items correctly', function () {
      const plugins = new PluginStore();
      expect(plugins.add(validPlugin)).to.have.a.property('items').that.has.a.property('length').that.equals(1);
      expect(plugins.add(validPluginList)).to.have.a.property('items').that.has.a.property('length').that.equals(4);
    });
    it('maintains the order of addition', function () {
      let plugins = new PluginStore();
      plugins.add(validPlugin);
      plugins.add(validPluginList);
      let addedPlugins = plugins.items;
      expect(addedPlugins[0].name).to.eql(validPlugin.name);
      expect(addedPlugins[2].name).to.eql(validPluginList[1].name);
      expect(addedPlugins[3].name).to.eql(validPluginList[2].name);
    });
    it('allows for more than one instance of a plugin to be added', function () {
      let plugins = new PluginStore();
      plugins.add(validPlugin);
      plugins.add(validPluginList);
      plugins.add(validPlugin);
      let addedPlugins = plugins.items;
      expect(addedPlugins[0].name).to.equal(validPlugin.name);
      expect(addedPlugins[4].name).to.equal(validPlugin.name);
    });
    it('throws a TypeError if invalid items are passed in', function () {
      expect(() => new PluginStore().add('wkahsd')).to.throw(TypeError, '[plugins-invalid]');
      expect(() => new PluginStore().add(invalidPlugin)).to.throw(TypeError, '[plugins-invalid]');
      expect(() => new PluginStore().add([validPlugin, invalidPlugin])).to.throw(TypeError, '[plugins-invalid]');
    });
  });
  describe('[Symbol.toStringTag]', function () {
    it('has the correct value', function () {
      const plugins = new PluginStore(validPlugin);
      expect(plugins[Symbol.toStringTag]).to.equal('PluginStore');
      expect(plugins).to.be.a('PluginStore');
    });
  });
  describe('PluginStore schema', function () {
    it('is a valid schema', function () {
      expect(validateSchema(pluginStoreSchema)).to.equal(true);
    });
  });
});
