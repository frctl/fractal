/* eslint no-unused-expressions: "off" */

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
      expect(entity.getIdentifier()).to.be.a('string');
      expect(entity.getIdentifier()).to.not.equal(entity2.getIdentifier());
    });
  });

  describe('.get()', function () {
    it(`gets a property value from the Entity`, function () {
      const entity = makeEntity();
      expect(entity.get('path')).to.equal(basicEntity.path);
    });
    it(`returns the fallback if the property is not defined`, function () {
      const entity = makeEntity();
      expect(entity.get('fabulous', 'hair')).to.equal('hair');
    });
    it(`works with dot-notation paths`, function () {
      const entity = makeEntity({
        foo: {
          bar: 'baz'
        }
      });
      expect(entity.get('foo.bar')).to.equal('baz');
    });
  });

  describe('.set()', function () {
    it(`sets a property value on the Entity`, function () {
      const entity = makeEntity();
      entity.set('foo', 'bar');
      expect(entity.get('foo')).to.equal('bar');
    });
    it(`works with dot-notation paths`, function () {
      const entity = makeEntity();
      entity.set('foo.bar', 'baz');
      expect(entity.foo.bar).to.equal('baz');
    });
    it(`works with managed property getters`, function () {
      const entity = makeEntity();
      expect(() => entity.set('id', 'baz')).to.throw('[invalid-set-id]');
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
      expect(entity.getIdentifier()).to.equal(clone.getIdentifier());
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
