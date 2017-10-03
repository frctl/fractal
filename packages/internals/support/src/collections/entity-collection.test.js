/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../../test/helpers');
const Entity = require('../entities/entity');
const Collection = require('./collection');
const EntityCollection = require('./entity-collection');

let items = [{
  cwd: '/',
  path: '/mice/mickey.js',
  contents: new Buffer('Mickey Mouse')
},
{
  cwd: '/',
  path: '/mice/jerry.js',
  contents: new Buffer('Jerry')
},
{
  cwd: '/',
  path: '/dogs/pluto.hbs',
  contents: new Buffer('Pluto')
},
{
  cwd: '/',
  path: '/dogs/odie.js',
  contents: new Buffer('Odie')
}
];

const newItem = {
  cwd: '/',
  path: '/mice/mickey2.js',
  contents: new Buffer('Mickey Mouse2')
};

const entityContents = 'var x = 123';
const baseEntity = {
  cwd: '/',
  base: '/test/',
  path: '/test/file.js',
  contents: new Buffer(entityContents)
};
const makeEntity = input => new Entity(input || baseEntity);
// items = items.map(makeEntity);

const makeCollection = input => new EntityCollection(input || items.slice(0));
const makeCollectionFrom = input => EntityCollection.from(input || items.slice(0));

describe('EntityCollection', function () {
  describe('constructor', function () {
    it('returns a new instance with correctly inherited properties', function () {
      const collection = new EntityCollection();
      expect(collection).to.exist;
      expect(EntityCollection.isCollection(collection)).to.equal(true);
      expect(collection.length).to.equal(0);
    });
  });

  describe('.from()', function () {
    it('successfully creates an EntityCollection when valid input is supplied', function () {
      expect(() => makeCollectionFrom('text')).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeCollectionFrom({single: 'object'})).to.not.throw();
      expect(() => makeCollectionFrom(new Entity({single: 'object'}))).to.not.throw();
      expect(() => makeCollectionFrom([Entity.from({single: 'object'}), Entity.from({another: 'object'})])).to.not.throw();
    });
  });

  describe('.push()', function () {
    it('returns a new EntityCollection instance', function () {
      const collection = makeCollection();
      const newCollection = collection.push(newItem);

      expect(newCollection).to.not.equal(collection);
      expect(collection.length).to.equal(items.length);
      expect(Collection.isCollection(newCollection)).to.be.true;
      expect(newCollection).to.be.an('EntityCollection');
    });
    it('adds the item to the end of the collection if item is Entity props', function () {
      const collection = makeCollection();
      const newCollection = collection.push(newItem);
      expect(newCollection.length).to.equal(items.length + 1);
      expect(newCollection[newCollection.length - 1].getData()).to.eql(newItem);
    });
    it('adds the item to the end of the collection if item is Entity instance', function () {
      const collection = makeCollection();
      const newCollection = collection.push(Entity.from(newItem));
      expect(newCollection.length).to.equal(items.length + 1);
      expect(newCollection[newCollection.length - 1].getData()).to.eql(newItem);
    });
  });

  describe(`.toJSON()`, function () {
    it(`calls to the 'toJSON' method of each item in the collection`, function () {
      const collection = makeCollection();
      expect(collection.toJSON()).to.eql(items.map(item => makeEntity(item).toJSON()));
    });
  });
  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const collection = makeCollection();
      expect(collection[Symbol.toStringTag]).to.equal('EntityCollection');
    });
  });
});
