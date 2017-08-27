const {Collection} = require('@frctl/support');
const {expect} = require('../../../../../test/helpers');
const PageCollection = require('./page-collection');

describe('PageCollection', function () {
  describe('constructor()', function () {
    it('extends Collection', () => {
      expect(new PageCollection()).to.be.instanceOf(Collection);
    });
  });
});
