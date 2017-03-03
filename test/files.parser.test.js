/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const expect = require('@frctl/utils/test').expect;
const parser = require('../src/files/parser');

const defaultPlugins = ['setName','identifyRole','configParser'];

describe('files parser', function () {
  it(`is a function`, function () {
    expect(parser()).to.be.a('function');
  });

  it(`has the expected plugins auto-registered in the correct order`, function () {
    const filesParser = parser();
    expect(filesParser.plugins.length).to.equal(3);
    for (var i = 0; i < defaultPlugins.length; i++) {
      expect(filesParser.plugins[i].name).to.equal(defaultPlugins[i]);
    }
  });

  describe('.addPlugin', function () {
    it(`adds a plugin to the stack`, function () {
      const filesParser = parser();
      const plugin = () => {};
      filesParser.addPlugin(plugin);
      expect(filesParser.plugins.includes(plugin)).to.be.true;
    });
  });

});
