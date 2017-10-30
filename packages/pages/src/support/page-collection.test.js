const {EntityCollection} = require('@frctl/support');
const {expect} = require('../../../../test/helpers');
const PageCollection = require('./page-collection');
const Page = require('./page');

const pages = [
  {
    id: 'page-1',
    permalink: 'foo/bar.html',
    contents: 'BAR',
    route: 'route-1',
    target: {
      name: 'bar'
    },
    tags: ['menu', 'featured']
  },
  {
    id: 'page-2',
    permalink: 'foo/baz.html',
    contents: 'BAZ',
    route: 'route-2',
    target: {
      name: 'baz'
    },
    tags: ['menu']
  }
].map(p => new Page(p));

const makeCollection = input => new PageCollection(input || pages.slice(0));
const makeCollectionFrom = input => PageCollection.from(input || pages.slice(0));

describe('PageCollection', function () {
  describe('constructor', function () {
    it('returns a new instance with correctly inherited properties', function () {
      const collection = new PageCollection();
      expect(PageCollection.isCollection(collection)).to.equal(true);
      expect(collection.length).to.equal(0);
    });
    it('extends EntityCollection', function () {
      const collection = new PageCollection();
      expect(collection).to.be.instanceof(EntityCollection);
    });
  });

  describe('.find()', function () {
    it(`can be called with a single string argument to find by 'id'`, function () {
      const collection = makeCollection();
      expect(collection.find('page-1')).to.equal(pages[0]);
    });
    it(`defers to its superclass for all other 'find' arguments`, function () {
      const collection = makeCollection();
      expect(collection.find('id', 'page-2')).to.equal(pages[1]);
      expect(collection.find({
        permalink: 'foo/bar.html'
      })).to.equal(pages[0]);

      expect(collection.find({
        id: 'doesnt-exist'
      })).to.equal(undefined);

      expect(collection.find(i => i.id === 'page-1')).to.equal(pages[0]);
    });
  });

  describe(`.findByRoute()`, function () {
    it(`finds a page based on it's route and target`, function () {
      const collection = makeCollection();
      expect(collection.findByRoute('route-2', {name: 'baz'})).to.equal(pages[1]);
      expect(collection.findByRoute('route-2', {name: 'bar'})).to.equal(undefined);
    });
  });

  describe(`.filterByTag()`, function () {
    it(`filters the page collection by tag`, function () {
      const collection = makeCollection();
      expect(collection.filterByTag('menu').count()).to.equal(2);
      expect(collection.filterByTag('featured').count()).to.equal(1);
      expect(collection.filterByTag('foo').count()).to.equal(0);
    });
  });

  describe('.from()', function () {
    it('successfully creates a PageCollection when valid input is supplied', function () {
      expect(() => makeCollectionFrom('text')).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom(pages[0])).to.not.throw();
      expect(() => makeCollectionFrom(new Page(pages[0]))).to.not.throw();
      expect(() => makeCollectionFrom(pages)).to.not.throw();
    });
  });

  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const collection = makeCollection();
      expect(collection[Symbol.toStringTag]).to.equal('PageCollection');
    });
  });
});
