/* eslint no-unused-expressions: "off" */

const {omit} = require('lodash');
const {hash} = require('@frctl/utils');
const {expect} = require('../../../../../test/helpers');
const Entity = require('./entity');

const basicEntity = {
  path: 'foo/bar'
};

const makeEntity = input => new Entity(input || basicEntity);

describe('Entity', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const entity = new Entity();
      expect(entity).to.exist;
    });
    it('assigns all props to the instance', function () {
      const entity = makeEntity();
      expect(entity.path).to.equal(basicEntity.path);
    });
    it('assigns a UUID to the entity if one is not supplied in props', function () {
      const entity = makeEntity();
      const entity2 = makeEntity();
      expect(entity._uuid).to.be.a('string');
      expect(entity._uuid).to.not.equal(entity2._uuid);
    });
  });

  describe('.clone()', function () {
    it('creates a new instance', function () {
      const entity = makeEntity();
      const newEntity = entity.clone();
      expect(newEntity instanceof Entity).to.equal(true);
      expect(newEntity).to.not.equal(entity);
    });
    it(`preserves the UUID of the entity`, function () {
      const entity = makeEntity();
      const clone = entity.clone();
      expect(entity._uuid).to.equal(clone._uuid);
    });
    it(`clones all entity properties`, function () {
      const entity = makeEntity();
      entity.foo = 'bar';
      const clone = entity.clone();
      expect(entity.foo).to.eql(clone.foo);
      expect(entity.toJSON()).to.eql(clone.toJSON());
    });
  });

});
