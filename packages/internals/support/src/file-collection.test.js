/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../test/helpers');
const FileCollection = require('./file-collection');

describe('FileCollection', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const fileCollection = new FileCollection();
      expect(fileCollection).to.exist;
    });
  });
});
