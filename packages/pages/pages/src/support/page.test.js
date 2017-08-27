const {Entity} = require('@frctl/support');
const {expect} = require('../../../../../test/helpers');
const Page = require('./page');

describe('Page', function () {
  describe('constructor()', function () {
    it('extends Entity', () => {
      expect(new Page()).to.be.instanceOf(Entity);
    });
  });
});
