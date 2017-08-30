/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../../test/helpers');
const Entity = require('../entities/entity');
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
