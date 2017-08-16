/* eslint no-unused-expressions: "off" */

const {hash} = require('@frctl/utils');
const {expect} = require('../../../../../test/helpers');
const Entity = require('./entity');

const basicEntity = {
  name: 'chocolate',
  path: 'factory/truck/shop/home',
  config: {
    sugar: '30%'
  }
};

const makeEntity = input => new Entity(input || basicEntity);

describe('Entity', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const entity = new Entity();
      expect(entity).to.exist;
    });
    it('assigns any props passed in to itself', function () {
      const entity = makeEntity();
      expect(entity.name).to.equal('chocolate');
      expect(entity.config.sugar).to.equal('30%');
    });
  });
  describe('.clone()', function () {
    it('creates a new instance', function () {
      const entity = makeEntity();
      const newEntity = entity.clone();
      expect(newEntity instanceof Entity).to.equal(true);
      expect(newEntity).to.not.equal(entity);
    });
    it('clones an entity when it is composed of plain object(s)', function () {
      const entity = makeEntity();
      const newEntity = entity.clone();
      expect(newEntity).to.deep.equal(entity);
      Object.keys(basicEntity).forEach(key => {
        expect(newEntity).to.have.deep.nested.property(key, basicEntity[key]);
      });
    });
    it('clones an entity and binds functions when it is composed of mixed object(s) and functions', function () {
      const entityWithMethod = Object.assign({src: function () {
        return {
          path: `ecuador/forest/bean/${this.name}`
        };
      }}, basicEntity);
      const entity = makeEntity(entityWithMethod);
      const newEntity = entity.clone();
      newEntity.name = 'coffee';
      expect(newEntity.src()).to.eql({path: 'ecuador/forest/bean/coffee'});
    });
    it(`defers to an entity prop's pre-defined 'clone' method`, function () {
      const entityWithClone = Object.assign({src: {
        clone: function () {
          return 'all gone!';
        }
      }}, basicEntity);
      const entity = makeEntity(entityWithClone);
      const newEntity = entity.clone();
      expect(newEntity.src).to.eql('all gone!');
    });
  });
  describe('.toJSON()', function () {
    it(`provides a simple 'JSON.stringify'-able representation of the entity`, function () {
      const entity = makeEntity();
      const jsonEntity = entity.toJSON();
      expect(jsonEntity).to.eql(basicEntity);
    });
    it(`does not output 'hidden' (underscore-prefixed) properties`, function () {
      const entityWithHidden = {_hidden: {chemicals: 'arsenic'}};
      const entity = makeEntity(entityWithHidden);
      const jsonEntity = entity.toJSON();
      expect(jsonEntity).to.eql({});
    });
    it(`defers to a property's 'toJSON' method`, function () {
      const entityWithToJSON = {colour: {toJSON: () => 'purple'}};
      const entity = makeEntity(entityWithToJSON);
      const jsonEntity = entity.toJSON();
      expect(jsonEntity.colour.toJSON).to.not.exist;
      expect(jsonEntity).to.eql({colour: 'purple'});
    });
    it(`converts Buffers to their String representation`, function () {
      const entityWithBuffer = {contents: Buffer.from('this is a tést')};
      const entity = makeEntity(entityWithBuffer);
      const jsonEntity = entity.toJSON();
      expect(jsonEntity.contents).to.equal('this is a tést');
    });
  });
  describe('.from()', function () {
    it(`creates a new instance of an Entity`, function () {
      const entity = Entity.from(basicEntity);
      expect(entity instanceof Entity).to.be.true;
      expect(entity.name).to.equal(basicEntity.name);
    });
  });
  describe('.hash()', function () {
    it(`returns a JSON-string representation of the entity`, function () {
      const entity = makeEntity();
      const hashedEntity = entity.hash();
      expect(hashedEntity).to.equal(hash(JSON.stringify(basicEntity)));
    });
    it(`defers to a property's own 'hash' method`, function () {
      const entityWithHash = {value: {hash: () => '123456789', otherProp: 'red', value: 'blue'}};
      const entity = makeEntity(entityWithHash);
      const hashedEntity = entity.hash();
      expect(hashedEntity).to.equal(hash(JSON.stringify({value: '123456789'})));
    });
  });
  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const entity = makeEntity();
      expect(entity[Symbol.toStringTag]).to.equal('Entity');
    });
  });
});
