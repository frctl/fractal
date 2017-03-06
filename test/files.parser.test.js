/* eslint no-unused-expressions : "off", handle-callback-err: "off" */

const Parser = require('@frctl/internals/parser');
const expect = require('@frctl/utils/test').expect;
const parser = require('../src/files/parser');

const defaultPlugins = ['setName', 'identifyRole', 'configParser'];

describe('files parser', function () {
  it(`is a Parser instance`, function () {
    expect(parser()).to.be.instanceof(Parser);
  });

  it(`has the expected plugins auto-registered in the correct order`, function () {
    const filesParser = parser();
    expect(filesParser.plugins.length).to.equal(3);
    for (var i = 0; i < defaultPlugins.length; i++) {
      expect(filesParser.plugins[i].name).to.equal(defaultPlugins[i]);
    }
  });
});
