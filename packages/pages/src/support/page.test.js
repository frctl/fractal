const {Entity} = require('@frctl/support');
const {expect} = require('../../../../test/helpers');
const Page = require('./page');

const page = new Page({
  id: 'page-1',
  permalink: 'foo/page.html',
  contents: 'this is a page'
});

describe('Page', function () {
  describe('constructor()', function () {
    it('extends Entity', () => {
      expect(page).to.be.instanceOf(Entity);
    });
    it('throws an error if invalid props are supplied', () => {
      expect(() => new Page()).to.throw('[properties-invalid]');
      expect(() => new Page({foo: 'bar'})).to.throw('[properties-invalid]');
    });
  });

  describe('.isPage()', function () {
    it('returns true if item is a Page and false otherwise', function () {
      expect(Page.isPage(page)).to.equal(true);
      expect(Page.isPage({})).to.equal(false);
    });
  });

  describe('.[Symbol.toStringTag]', function () {
    it('Provides a meaningful string tag for the object', function () {
      expect(page[Symbol.toStringTag]).to.equal('Page');
    });
  });
});
