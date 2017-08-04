/* eslint no-unused-expressions: "off" */

const {expect} = require('../../../../test/helpers');
const Entity = require('./entity');

const basicEntity = {
  name: 'chocolate',
  path: 'factory/truck/shop/home',
  config: {
    sugar: '30%'
  }
};
const entityWithMethod = {
  name: 'chocolate',
  path: 'factory/truck/shop/home',
  config: {
    sugar: '30%'
  },
  src: function () {
    return {
      path: `ecuador/forest/bean/${this.name}`
    };
  }
};
const entityWithClone = {
  name: 'chocolate',
  path: 'factory/truck/shop/home',
  config: {
    sugar: '30%'
  },
  src: {
    clone: function () {
      return 'all gone!';
    }
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
      expect(newEntity).to.eql(entity);
      expect(newEntity).to.eql(basicEntity);
    });
    it('clones an entity and binds functions when it is composed of mixed object(s) and functions', function () {
      const entity = makeEntity(entityWithMethod);
      const newEntity = entity.clone();
      newEntity.name = 'coffee';
      expect(newEntity.src()).to.eql({path: 'ecuador/forest/bean/coffee'});
    });
    it(`defers to an entity prop's pre-defined 'clone' method`, function () {
      const entity = makeEntity(entityWithClone);
      const newEntity = entity.clone();
      expect(newEntity.src).to.eql('all gone!');
    });
  });
  describe('.toJSON()', function () {
    it(`provides a 'JSON.stringify'-able representation of the entity`);
  });
});
