/* eslint no-unused-expressions: "off" */

const {omit} = require('lodash');
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
items = items.map(makeEntity);

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
    it('throws an error if multiple items with the same ID are provided', function () {
      expect(() => {
        return new EntityCollection([{id: 'foo'}, {id: 'bar'}, {id: 'foo'}]);
      }).to.throw('[duplicate-ids]');
    });
  });

  describe('.from()', function () {
    it('successfully creates an EntityCollection when valid input is supplied', function () {
      expect(() => makeCollectionFrom('text')).to.throw(TypeError, '[items-invalid]');
      expect(() => makeCollectionFrom([new Entity({single: 'object'})])).to.not.throw();
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
      expect(omit(newCollection[newCollection.length - 1].getProps(), 'id')).to.eql(newItem);
    });
    it('adds the item to the end of the collection if item is Entity instance', function () {
      const collection = makeCollection();
      const newCollection = collection.push(Entity.from(newItem));
      expect(newCollection.length).to.equal(items.length + 1);
      expect(omit(newCollection[newCollection.length - 1].getProps(), 'id')).to.eql(newItem);
    });
  });

  describe('.find()', function () {
    it(`can be called with a single string argument to find the 'id'`, function () {
      const collection = makeCollection([
        new Entity({
          id: 'foo'
        }),
        new Entity({
          id: 'bar'
        })
      ]);
      expect(collection.find('foo'))
      .to.be.a('Entity')
      .with.property('id')
      .that.equals('foo');
    });
    it(`defers to its superclass for all other 'find' arguments`, function () {
      const collection = makeCollection([
        new Entity({
          id: 'foo'
        }),
        new Entity({
          id: 'bar'
        })
      ]);
      expect(collection.find('id', 'bar'))
      .to.be.a('Entity')
      .with.property('id')
      .that.equals('bar');

      expect(collection.find({
        id: 'dfsdfsdf'
      })).to.be.undefined;

      expect(collection.find(
        i => i.id === 'foo'
      )).to.be.a('Entity')
      .with.property('id')
      .that.equals('foo');
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
