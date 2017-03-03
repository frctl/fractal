/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const expect = require('@frctl/utils/test').expect;
const parser = require('../src/components/parser');

const defaultPlugins = ['setConfig', 'setName', 'setLabel'];

describe('components parser', function () {
  it(`is a function`, function () {
    expect(parser()).to.be.a('function');
  });

  it(`has the expected plugins auto-registered in the correct order`, function () {
    const componentsParser = parser();
    expect(componentsParser.plugins.length).to.equal(3);
    for (var i = 0; i < defaultPlugins.length; i++) {
      expect(componentsParser.plugins[i].name).to.equal(defaultPlugins[i]);
    }
  });

  describe('.addPlugin', function () {
    it(`adds a plugin to the stack`, function () {
      const componentsParser = parser();
      const plugin = () => {};
      componentsParser.addPlugin(plugin);
      expect(componentsParser.plugins.includes(plugin)).to.be.true;
    });
  });
});
