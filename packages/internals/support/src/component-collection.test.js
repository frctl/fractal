/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../test/helpers');
const Collection = require('./collection');
const File = require('./file');
const FileCollection = require('./file-collection');
const Component = require('./component');

const ComponentCollection = require('./component-collection');

let items = [{
  name: 'mickey',
  path: '/characters/mice/mickey',
  relative: 'characters/mice/mickey',
  config: {
    disney: true,
    type: 'mouse'
  }
},
{
  name: 'jerry',
  path: '/characters/mice/jerry',
  relative: 'characters/mice/jerry',
  config: {
    disney: false,
    type: 'mouse'
  }
},
{
  name: 'mighty',
  path: '/characters/mice/mighty',
  relative: 'characters/mice/mighty',
  config: {
    disney: false,
    type: 'mouse'
  }
},
{
  name: 'pluto',
  path: '/characters/dogs/pluto',
  relative: 'characters/dogs/pluto',
  config: {
    disney: true,
    type: 'dog'
  }
},
{
  name: 'odie',
  path: '/characters/dogs/odie',
  relative: 'characters/dogs/odie',
  config: {
    disney: false,
    type: 'dog'
  }
},
{
  name: 'jerry',
  path: '/characters/dogs/jerry',
  relative: 'characters/dogs/jerry',
  config: {
    disney: false,
    type: 'dog'
  }
}
];

const makeComponent = input => new Component(Object.assign({
  src: new File({path: '/src/test/index.js'}),
  variants: new Collection(),
  files: new FileCollection()
}, input));
const makeCollection = input => new ComponentCollection(input || items.slice(0));

items = items.map(makeComponent);

describe('ComponentCollection', function () {
  describe('constructor', function () {
    it('returns a new instance with correctly inherited properties', function () {
      const collection = new ComponentCollection();
      expect(collection).to.exist;
      expect(Collection.isCollection(collection)).to.equal(true);
      expect(collection.length).to.equal(0);
    });
  });

  describe('.find()', function () {
    it(`can be called with a single string argument to find the 'name'`, function () {
      const collection = makeCollection();
      expect(collection.find('mickey')).to.equal(items[0]);
    });
    it.skip(`can be called with a single string argument to find the 'component/path'`, function () {
      const collection = makeCollection();
      expect(collection.find('dogs/jerry')).to.equal(items[5]);
    });
    it(`defers to its superclass for all other 'find' arguments`, function () {
      const collection = makeCollection();
      expect(collection.find('name', 'odie')).to.equal(items[4]);
      expect(collection.find({
        config: {
          type: 'dog'
        }
      })).to.equal(items[3]);
      expect(collection.find({
        name: 'mickey',
        config: {
          disney: false
        }
      })).to.equal(undefined);
      expect(collection.find(i => i.name === 'mickey')).to.equal(items[0]);
    });
  });

  describe(`.filterByPath()`, function () {
    it('returns a collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.filterByPath('*');
      expect(ComponentCollection.isCollection(newCollection));
      expect(newCollection instanceof ComponentCollection).to.equal(true);
    });

    it(`filters based on a glob string argument for the 'component/path'`, function () {
      const collection = makeCollection();
      expect(collection.filterByPath('*/dogs/jerry').count()).to.equal(1);
    });
  });

  describe(`.rejectByPath()`, function () {
    it('returns a collection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.rejectByPath('*');
      expect(ComponentCollection.isCollection(newCollection));
      expect(newCollection instanceof ComponentCollection).to.equal(true);
    });

    it(`rejects based on a glob string argument for the 'component/path'`, function () {
      const collection = makeCollection();
      expect(collection.rejectByPath('*/dogs/jerry').count()).to.equal(items.length - 1);
    });
  });

  describe(`.toJSON()`, function () {
    it(`calls to the 'toJSON' method of each item in the collection`, function () {
      let collection = makeCollection();
      expect(collection.toJSON()).to.eql(items.map(item => item.toJSON()));
    });
  });
});
