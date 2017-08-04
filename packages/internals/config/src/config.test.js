/* eslint handle-callback-err: off, no-unused-expressions: off */

const {expect, sinon} = require('../../../../test/helpers');
const Config = require('./config');

const schema = {
  properties: {
    foo: {
      type: 'number'
    }
  }
};

describe('Config', function () {
  describe('constructor', function () {
    it('throws an error if a non-object options argument is provided', function () {
      expect(() => new Config('foo')).to.throw(TypeError, '[config-opts-invalid]');
      expect(() => new Config({})).to.not.throw(TypeError);
    });

    it('accepts an initial config data via opts.data', function () {
      const data = {prop: 'val'};
      const config = new Config({data});
      expect(config.data).to.eql(data);
    });

    it('clones provided data to prevent mutation', function () {
      const data = {prop: 'val'};
      const config = new Config({data});
      expect(config.data).to.eql(data);
      expect(config.data).to.not.equal(data);
    });

    it('validates initial input data against a schema, if supplied', function () {
      expect(() => new Config({data: {foo: 123}, schema})).to.not.throw();
      expect(() => new Config({data: {foo: '123'}, schema})).to.throw();
    });
  });

  describe('.data', function () {
    it('returns the full config data object', function () {
      const data = {
        one: 'two',
        three: {
          nested: 'four'
        }
      };
      const config = new Config({data});
      expect(config.data).to.eql(data);
    });
  });

  describe('.get()', function () {
    it('retrieves a config property via dot-notation syntax', function () {
      const data = {
        one: 'two',
        three: {
          nested: 'four'
        }
      };
      const config = new Config({data});
      expect(config.get('three.nested')).to.eql(data.three.nested);
    });

    it('returns the supplied fallback argument if the property lookup returns undefined', function () {
      const config = new Config({});
      expect(config.get('does.not.exist')).to.equal(undefined);
      expect(config.get('does.not.exist', 'fallback')).to.equal('fallback');
    });

    it('runs the result through all relevant accessors', function () {
      const config = new Config({
        data: {
          foo: {
            bar: 'baz'
          }
        }
      });
      config.addAccessor('foo.bar', value => '!' + value);
      config.addAccessor('foo', value => '@' + value);
      expect(config.get('foo.bar')).to.equal('@!baz');
    });

    it('returns cached data where possible to prevent needlessly re-running accessors', function () {
      const config = new Config({
        data: {
          foo: {
            bar: 'baz'
          }
        }
      });

      const accessorSpy = sinon.spy(val => val);
      config.addAccessor('foo.bar', accessorSpy);

      expect(config.get('foo.bar')).to.equal('baz');
      expect(accessorSpy.calledOnce).to.equal(true);
      expect(config.get('foo.bar')).to.equal('baz');
      expect(accessorSpy.calledTwice).to.equal(false);

      config.set('foo.bar', 'boop');
      expect(config.get('foo.bar')).to.equal('boop');
      expect(accessorSpy.calledTwice).to.equal(true);
    });
  });

  describe('.set()', function () {
    it('sets a config property via dot-notation syntax', function () {
      const config = new Config({});
      config.set('foo.bar', 'baz');
      expect(config.get('foo.bar')).to.equal('baz');
    });

    it('returns the config class instance', function () {
      const config = new Config({});
      expect(config.set('bar', 'foo')).to.equal(config);
    });

    it('throws an error if setting a value invalidates the config schema', function () {
      const config = new Config({schema});
      expect(() => config.set('foo', 123)).to.not.throw();
      expect(() => config.set('foo', 'bar')).to.throw();
    });
  });

  describe('.getData()', function () {
    it('retrieves a config property via dot-notation syntax', function () {
      const data = {
        one: 'two',
        three: {
          nested: 'four'
        }
      };
      const config = new Config({data});
      expect(config.getData('three.nested')).to.eql(data.three.nested);
    });
    it('does not run the result through accessors', function () {
      const config = new Config({
        data: {
          foo: {
            bar: 'baz'
          }
        }
      });
      config.addAccessor('foo.bar', value => '!' + value);
      config.addAccessor('foo', value => '@' + value);
      expect(config.getData('foo.bar')).to.equal('baz');
    });
  });

  describe('.addAccessor()', function () {
    it('adds an accessor', function () {
      const config = new Config();
      config.addAccessor('foo.bar', val => val);
      const accessor = config.accessors.find(acc => acc.path === 'foo.bar');
      expect(accessor).to.be.an('object');
      expect(accessor).to.have.property('path');
      expect(accessor).to.have.property('handler');
    });
  });

  describe('.getAccessorsForPath()', function () {
    it('retrieves all accessors that match the dot-notation path', function () {
      const config = new Config();
      config.addAccessor('foo.bar', val => val);
      config.addAccessor('foo.bar.baz', val => val);
      config.addAccessor('bax.foo.bar', val => val);
      config.addAccessor('fooooo', val => val);
      config.addAccessor('bar', val => val);
      expect(config.getAccessorsForPath('foo.bar').length).to.equal(1);
      expect(config.getAccessorsForPath('foo.bar.baz').length).to.equal(2);
      expect(config.getAccessorsForPath('bar').length).to.equal(1);
      expect(config.getAccessorsForPath('foo').length).to.equal(0);
    });

    it('returns accessors sorted by descending path length', function () {
      const config = new Config();
      config.addAccessor('foo.bar', val => val);
      config.addAccessor('foo.bar.baz.boop', val => val);
      config.addAccessor('foo.bar.baz', val => val);
      const accessors = config.getAccessorsForPath('foo.bar.baz.boop');
      expect(accessors.map(acc => acc.path)).to.eql(['foo.bar.baz.boop', 'foo.bar.baz', 'foo.bar']);
    });
  });
});
