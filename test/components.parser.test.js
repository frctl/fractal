/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const Parser = require('@frctl/internals/parser');
const expect = require('@frctl/utils/test').expect;
const parser = require('../src/parser/components/parser');

const defaultPlugins = ['setConfig', 'setName', 'setLabel'];

describe('components parser', function () {
  it(`is an instance of Parser`, function () {
    expect(parser()).to.be.an.instanceof(Parser);
  });

  it(`has the expected plugins auto-registered in the correct order`, function () {
    const componentsParser = parser();
    expect(componentsParser.plugins.length).to.equal(3);
    for (var i = 0; i < defaultPlugins.length; i++) {
      expect(componentsParser.plugins[i].name).to.equal(defaultPlugins[i]);
    }
  });
});
