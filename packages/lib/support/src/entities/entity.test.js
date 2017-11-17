/* eslint no-unused-expressions: "off" */

const {omit} = require('lodash');
const {hash} = require('@frctl/utils');
const {expect} = require('../../../../../test/helpers');
const Entity = require('./entity');

const basicEntity = {
  path: 'foo/bar'
};

const makeEntity = input => new Entity(input || basicEntity);

describe.only('Entity', function () {
  describe('constructor', function () {
    it('returns a new instance', function () {
      const entity = new Entity();
      expect(entity).to.exist;
    });
    it('assigns all props to the instance', function () {
      const entity = makeEntity();
      expect(entity.path).to.equal(basicEntity.path);
    });
    it('uses the supplied UUID if provided', function () {
      const entity = makeEntity({
        uuid: '1234'
      });
      expect(entity.uuid).to.equal('1234');
    });
    it('assigns a UUID to the entity if one is not supplied in props', function () {
      const entity = makeEntity();
      const entity2 = makeEntity();
      expect(entity.uuid).to.be.a('string');
      expect(entity.uuid).to.not.equal(entity2.uuid);
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
      expect(entity.uuid).to.equal(clone.uuid);
    });
    it(`clones all entity properties`, function () {
      const entity = makeEntity();
      entity.foo = 'bar';
      const clone = entity.clone();
      expect(entity.foo).to.eql(clone.foo);
      expect(entity.toJSON()).to.eql(clone.toJSON());
    });
  });

  describe('.uuid', function () {
    it('returns the UUID', function () {
      const entity = makeEntity();
      expect(entity.uuid).to.be.a('string');
    });
    it('is not writable', function () {
      const entity = makeEntity();
      const uuid = entity.uuid;
      expect(() => entity.uuid = 'foo').to.throw('[invalid-set-uuid]');
    });
  });
});
