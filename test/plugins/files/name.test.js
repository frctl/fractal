/* eslint no-unused-expressions : "off" */

const expect = require('@frctl/utils/test').expect;
const namePlugin = require('../../../src/files/plugins/name');

describe('Name Plugin', function () {
  describe('constructor', function () {
    it(`returns a function`, function () {
      const plugin = namePlugin();
      expect(plugin).to.be.a('function');
    });
  });
});
