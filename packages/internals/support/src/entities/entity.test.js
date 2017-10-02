/* eslint no-unused-expressions: "off" */

const {hash} = require('@frctl/utils');
const {expect} = require('../../../../../test/helpers');
const Entity = require('./entity');

const basicEntity = {
  path: 'factory/truck/shop/home',
  name: 'chocolate',
  empty: undefined,
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
    it('clones both the config and the store data', function () {
      const entity = makeEntity();
      entity.name = 'coffee';
      entity.foo = 'bar';
      const newEntity = entity.clone();
      const clonedProps = Object.assign({}, basicEntity, {
        name: 'coffee',
        foo: 'bar'
      });
      expect(newEntity).to.deep.equal(entity);
      Object.keys(clonedProps).forEach(key => {
        expect(newEntity).to.have.deep.nested.property(key, clonedProps[key]);
      });
    });
    it('clones an entity and binds functions when it is composed of mixed object(s) and functions', function () {
      const entityWithMethod = Object.assign({}, basicEntity, {
        src: function () {
          return {
            path: `ecuador/forest/bean/${this.name}`
          };
        }
      });
      const entity = makeEntity(entityWithMethod);
      const newEntity = entity.clone();
      newEntity.name = 'coffee';
      expect(newEntity.src()).to.eql({
        path: 'ecuador/forest/bean/coffee'
      });
    });
    it(`defers to an entity prop's pre-defined 'clone' method`, function () {
      const entityWithClone = Object.assign({}, basicEntity, {
        src: {
          clone: function () {
            return 'all gone!';
          }
        }
      });
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
      const entityWithHidden = {
        _hidden: {
          chemicals: 'arsenic'
        }
      };
      const entity = makeEntity(entityWithHidden);
      const jsonEntity = entity.toJSON();
      expect(jsonEntity).to.eql({});
    });
    it(`defers to a property's 'toJSON' method`, function () {
      const entityWithToJSON = {
        colour: {
          toJSON: () => 'purple'
        }
      };
      const entity = makeEntity(entityWithToJSON);
      const jsonEntity = entity.toJSON();
      expect(jsonEntity.colour.toJSON).to.not.exist;
      expect(jsonEntity).to.eql({
        colour: 'purple'
      });
    });
    it(`converts Buffers to their String representation`, function () {
      const entityWithBuffer = {
        contents: Buffer.from('this is a tést')
      };
      const entity = makeEntity(entityWithBuffer);
      const jsonEntity = entity.toJSON();
      expect(jsonEntity.contents).to.equal('this is a tést');
    });
    it('correctly output the value of defined getters');
  });

  describe('.from()', function () {
    it(`creates a new instance of an Entity`, function () {
      const entity = Entity.from(basicEntity);
      expect(entity instanceof Entity).to.be.true;
      expect(entity.name).to.equal(basicEntity.name);
    });
    it('returns the same instance if props is already an Entity', function () {
      const first = Entity.from(basicEntity);
      const second = Entity.from(first);
      expect(second instanceof Entity).to.be.true;
      expect(first.name).to.equal(second.name);
      expect(first).to.eql(second);
      expect(first).to.equal(second);
    });
  });

  describe('.hash()', function () {
    it(`returns a JSON-string representation of the entity`, function () {
      const entity = makeEntity();
      const hashedEntity = entity.hash();
      expect(hashedEntity).to.equal(hash(JSON.stringify(basicEntity)));
    });
    it(`defers to a property's own 'hash' method`, function () {
      const entityWithHash = {
        value: {
          hash: () => '123456789',
          otherProp: 'red',
          value: 'blue'
        }
      };
      const entity = makeEntity(entityWithHash);
      const hashedEntity = entity.hash();
      expect(hashedEntity).to.equal(hash(JSON.stringify({
        value: '123456789'
      })));
    });
  });

  describe('.set()/get()', function () {
    it('sets and gets a value on the private data store', function () {
      const entity = makeEntity();
      entity.set('foo', 'bar');
      expect(entity.foo).to.equal('bar');
      expect(entity.get('foo')).to.equal('bar');
    });
    it('sets and gets nested paths', function () {
      const entity = makeEntity();
      entity.set('foo.bar[0]', 'one');
      expect(entity.get('foo.bar[0]')).to.equal('one');
      expect(entity.get('foo')).to.eql({bar: ['one']});
    });
    it('create a copy of the original value', function () {
      const entity = makeEntity();
      const status = {
        tag: 'wip',
        label: 'Work in progress'
      };
      entity.set('status', status);
      expect(entity.get('status')).to.not.equal(status);
      expect(entity.get('status')).to.deep.eql(status);
    });
  });

  describe('.unset()', function () {
    it('unsets store values', function () {
      const entity = makeEntity();
      entity.set('foo', 'bar');
      expect(entity.unset('foo')).to.equal(true);
      expect(entity.get('foo')).to.equal(undefined);
    });
  });

  describe('.set()', function () {
    it('returns value if successful ', function () {
      const entity = makeEntity();
      expect(entity.set('foo', 'bar')).to.equal('bar');
      expect(entity.foo = 'bar').to.equal('bar');
    });
    it('shadows config data of the same name', function () {
      const entity = makeEntity();
      expect(entity.name).to.equal('chocolate');
      entity.set('name', 'coffee');
      expect(entity.name).to.equal('coffee');
      expect(entity.unset('name')).to.equal(true);
      expect(entity.name).to.equal('chocolate');
    });
  });

  describe('.get()', function () {
    it(`falls back to the 'fallback' argument if neither 'data' nor 'config' return a value`, function () {
      const entity = makeEntity();
      expect(entity.get('fabulous', 'hair')).to.equal('hair');
    });
  });

  describe('.defineSetter()', function () {
    it(`adds an interceding method on any 'set' operation for the given path`, function () {
      const entity = makeEntity();
      entity.defineSetter('name', (value, entity) => value + ': ' + entity.get('path'));
      entity.name = 'setter';
      expect(entity.name).to.equal('setter: factory/truck/shop/home');
    });
    it(`allows multiple setters for a given path`, function () {
      const entity = makeEntity();
      entity.defineSetter('name', (value, entity) => value + ' 1!');
      entity.defineSetter('name', (value, entity) => ({label: value + ' 2!!'}));
      entity.name = 'setter';
      expect(entity.name).to.eql({label: 'setter 1! 2!!'});
    });
    it(`only applies setters defined for a given path`, function () {
      const entity = makeEntity();
      entity.defineSetter('name', (value, entity) => value + ' 1!');
      entity.defineSetter('src', (value, entity) => value + ' 2!!');
      entity.name = 'setter';
      expect(entity.name).to.equal('setter 1!');
    });
  });

  describe('.defineGetter()', function () {
    it(`adds an interceding method on any 'get' operation for the given path`, function () {
      const entity = makeEntity();
      entity.defineGetter('name', (value, entity) => value + ' 1!');
      expect(entity.name).to.equal('chocolate 1!');
    });
    it(`can define a property that otherwise doesn't exist`, function () {
      const entity = makeEntity();
      entity.defineGetter('pathname', (value, entity) => entity.get('path') + '/' + entity.get('name'));
      expect(entity.pathname).to.equal('factory/truck/shop/home/chocolate');
    });
    it(`allows multiple getters for a given path`, function () {
      const entity = makeEntity();
      entity.defineGetter('name', (value, entity) => value + ' 1!');
      entity.defineGetter('name', (value, entity) => ({label: value + ' 2!!'}));
      expect(entity.name).to.eql({label: 'chocolate 1! 2!!'});
    });
  });

  describe('.getConfig()', function () {
    it('retrieves initialization data', function () {
      const entity = makeEntity();
      expect(entity.getConfig()).to.eql(basicEntity);
      expect(entity.getConfig()).to.not.equal(basicEntity);
    });
  });

  describe('.getData()', function () {
    it('retrieves store data', function () {
      const entity = makeEntity();
      expect(entity.getData()).to.eql({});
      entity.name = 'coffee';
      expect(entity.getData()).to.eql({name: 'coffee'});
    });
  });

  describe('.getComputedProps()', function () {
    it(`returns a flattened representation of the Entity's props`, function () {
      const entity = makeEntity();
      entity.name = 'coffee';
      entity.foo = 'bar';
      const entityProps = entity.getComputedProps();
      const expectedProps = Object.assign({}, basicEntity, {
        name: 'coffee',
        foo: 'bar'
      });
      expect(entityProps).to.deep.equal(expectedProps);
    });
  });

  describe('.inspect()', function () {
    it('returns a loggable representation of the Entity', function () {
      const entity = makeEntity();
      expect(entity.inspect()).to.equal(`Entity ${JSON.stringify(entity.getComputedProps())}`);
    });
  });

  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const entity = makeEntity();
      expect(entity[Symbol.toStringTag]).to.equal('Entity');
    });
  });
});
