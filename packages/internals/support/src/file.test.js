/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../test/helpers');
const File = require('./file');

describe('File', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const file = new File();
      expect(file).to.exist;
    });
  });
});
