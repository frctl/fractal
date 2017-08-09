/* eslint handle-callback-err: off, no-unused-expressions: off */

const {expect} = require('../../../../../test/helpers');
const makePlugin = require('../../test/helpers').makePlugin;
const Plugins = require('./plugins');

const validPlugin = makePlugin('test-plugin');
const validCollectionfreePlugin = {
  name: 'test-plugin',
  handler: function () {}
};
const invalidPlugin = {
  name: 'test-plugin',
  collection: 'files'
};
const newPlugin = n => makePlugin(`test-plugin-${n}`);
const pluginList = [
  newPlugin(1),
  newPlugin(2, 'components'),
  newPlugin(3)
];

describe('Plugins', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const plugins = new Plugins();
      expect(plugins instanceof Plugins).to.be.true;
      expect(plugins).to.have.a.property('items');
    });
    it('adds items passed to constructor correctly', function () {
      let plugins = new Plugins(validPlugin);
      expect(plugins).to.have.a.property('items').that.has.a.property('length').that.equals(1);
      plugins = new Plugins(pluginList);
      expect(plugins).to.have.a.property('items').that.has.a.property('length').that.equals(3);
    });
    it('sets options correctly', function () {
      let plugins = new Plugins();
      expect(plugins).to.have.a.property('options').that.has.a.property('defaultCollection').that.equals('files');
      plugins = new Plugins(null, {defaultCollection: 'components'});
      expect(plugins).to.have.a.property('options').that.has.a.property('defaultCollection').that.equals('components');
    });
    it('throws a TypeError if invalid items are passed in', function () {
      expect(() => new Plugins('wkahsd')).to.throw(TypeError, '[plugins-invalid]');
      expect(() => new Plugins(invalidPlugin)).to.throw(TypeError, '[plugins-invalid]');
      expect(() => new Plugins([validPlugin, invalidPlugin])).to.throw(TypeError, '[plugins-invalid]');
    });
  });
  describe('.add()', function () {
    it('adds items correctly', function () {
      const plugins = new Plugins();
      expect(plugins.add(validPlugin)).to.have.a.property('items').that.has.a.property('length').that.equals(1);
      expect(plugins.add(pluginList)).to.have.a.property('items').that.has.a.property('length').that.equals(4);
    });
    it('assigns defaults correctly, where missing', function () {
      let plugins = new Plugins();
      plugins.add(validCollectionfreePlugin);
      let currentPlugin = plugins.items[0];
      expect(currentPlugin).to.have.a.property('collection').that.equals('files');
      plugins = new Plugins(null, {defaultCollection: 'components'});
      plugins.add(validCollectionfreePlugin);
      currentPlugin = plugins.items[0];
      expect(currentPlugin).to.have.a.property('collection').that.equals('components');
    });
    it('maintains the order of addition', function () {
      let plugins = new Plugins();
      plugins.add(validPlugin);
      plugins.add(pluginList);
      let addedPlugins = plugins.items;
      expect(addedPlugins[0]).to.eql(validPlugin);
      expect(addedPlugins[2]).to.eql(pluginList[1]);
      expect(addedPlugins[3]).to.eql(pluginList[2]);
    });
    it('allows for more than one instance of a plugin to be added', function () {
      let plugins = new Plugins();
      plugins.add(validPlugin);
      plugins.add(pluginList);
      plugins.add(validPlugin);
      let addedPlugins = plugins.items;
      expect(addedPlugins[0].name).to.equal(validPlugin.name);
      expect(addedPlugins[4].name).to.equal(validPlugin.name);
    });
    it('throws a TypeError if invalid items are passed in', function () {
      expect(() => new Plugins().add('wkahsd')).to.throw(TypeError, '[plugins-invalid]');
      expect(() => new Plugins().add(invalidPlugin)).to.throw(TypeError, '[plugins-invalid]');
      expect(() => new Plugins().add([validPlugin, invalidPlugin])).to.throw(TypeError, '[plugins-invalid]');
    });
  });
});
