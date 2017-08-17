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
    it('throws an error if a non-object data argument is provided', function () {
      expect(() => new Config('foo')).to.throw(TypeError, '[config-data-invalid]');
      expect(() => new Config({})).to.not.throw(TypeError);
    });

    it('throws an error if a non-object options argument is provided', function () {
      expect(() => new Config({}, 'foo')).to.throw(TypeError, '[config-opts-invalid]');
      expect(() => new Config({}, {})).to.not.throw(TypeError);
    });

    it('accepts initial config data', function () {
      const data = {prop: 'val'};
      const config = new Config(data);
      expect(config.data).to.eql(data);
    });

    it('clones provided data to prevent mutation', function () {
      const data = {prop: 'val'};
      const config = new Config(data);
      expect(config.data).to.eql(data);
      expect(config.data).to.not.equal(data);
    });

    it('adds accessors supplied via opts.accessors', function () {
      const accessors = [{
        path: 'foo.bar',
        handler() {}
      }];
      const config = new Config({}, {accessors});
      expect(config.accessors.find(acc => acc.path === 'foo.bar')).to.not.equal(undefined);
    });

    it('validates initial input data against a schema, if supplied', function () {
      expect(() => new Config({foo: 123}, {schema})).to.not.throw();
      expect(() => new Config({foo: '123'}, {schema})).to.throw('[config-invalid]');
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
      const config = new Config(data);
      expect(config.data).to.eql(data);
    });
    it('is cloned so that the data is not mutable', function () {
      const data = {
        one: 'two',
        three: {
          nested: 'four'
        }
      };
      const config = new Config(data);
      const configData = config.data;
      expect(configData).to.not.equal(data);
      configData.one = 2;
      expect(config.getData('one')).to.equal('two');
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
      const config = new Config(data);
      expect(config.get('three.nested')).to.eql(data.three.nested);
    });

    it('returns the supplied fallback argument if the property lookup returns undefined', function () {
      const config = new Config({});
      expect(config.get('does.not.exist')).to.equal(undefined);
      expect(config.get('does.not.exist', 'fallback')).to.equal('fallback');
    });

    it('runs the result through all relevant accessors', function () {
      const config = new Config({
        foo: {
          bar: 'baz'
        }
      });
      config.addAccessor('foo.bar', value => '!' + value);
      expect(config.get('foo.bar')).to.equal('!baz');
      config.addAccessor('foo.bar', value => '@' + value);
      expect(config.get('foo.bar')).to.equal('@!baz');
    });

    it('maps values through matching accessors if the lookup value is an array or object', function () {
      const config = new Config({
        foo: {
          bar: 'baz'
        },
        arr: ['one', 'two']
      });
      config.addAccessor('foo.bar', value => '!' + value);
      expect(config.get('foo')).to.be.an('object').with.property('bar').that.equals('!baz');
      config.addAccessor('arr.0', value => '1' + value);
      config.addAccessor('arr.1', value => '2' + value);
      config.addAccessor('arr', items => items.map(item => item + '!'));
      expect(config.get('arr')).to.eql(['1one!', '2two!']);
    });

    it('returns cached data where possible to prevent needlessly re-running accessors', function () {
      const config = new Config({
        foo: {
          bar: 'baz'
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

    it('calls accessors with the property value and the current instance as arguments', function () {
      const config = new Config({
        foo: {
          bar: 'baz'
        }
      });
      const accessorSpy = sinon.spy(val => val);
      config.addAccessor('foo.bar', accessorSpy);
      config.get('foo.bar');
      expect(accessorSpy.calledWith('baz', config)).to.equal(true);
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
      const config = new Config({}, {schema});
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
      const config = new Config(data);
      expect(config.getData('three.nested')).to.eql(data.three.nested);
    });
    it('does not run the result through accessors', function () {
      const config = new Config({
        foo: {
          bar: 'baz'
        }
      });
      config.addAccessor('foo.bar', value => '!' + value);
      expect(config.getData('foo.bar')).to.equal('baz');
    });
    it('deep clones objects and arrays', function () {
      const data = {
        foo: {
          bar: 'baz'
        }
      };
      const config = new Config(data);
      expect(config.getData('foo')).to.eql(data.foo);
      expect(config.getData('foo')).to.not.equal(data.foo);
    });
    it('leaves functions intact', function () {
      const data = {
        foo: function () {}
      };
      const config = new Config(data);
      expect(config.getData('foo')).to.equal(data.foo);
    });
  });

  describe('.getRaw()', function () {
    it('retrieves the raw config property value', function () {
      const data = {
        one: 'two',
        three: {
          nested: 'four'
        }
      };
      const config = new Config(data);
      config.addAccessor('three.nested', value => '!' + value);
      expect(config.getRaw('three.nested')).to.eql(data.three.nested);
    });
  });

  describe('.pick()', function () {
    it('returns an object consisting of key/values picked from the data', function () {
      const config = new Config({
        foo: 'bar',
        one: 'two',
        nested: {
          prop: 'child'
        }
      });
      expect(config.pick('foo', 'nested.prop')).to.eql({
        foo: 'bar',
        nested: {
          prop: 'child'
        }
      });
      expect(config.pick(['foo', 'nested.prop'])).to.eql(config.pick('foo', 'nested.prop'));
      config.addAccessor('foo', val => '!' + val);
      expect(config.pick(['foo'])).to.eql({
        foo: '!bar'
      });
    });
  });

  describe('.push()', function () {
    it('pushes a value onto an array property', function () {
      const config = new Config({
        foo: ['bar']
      });
      config.push('foo', 'baz');
      expect(config.get('foo')).to.eql(['bar', 'baz']);
    });
    it('throws an error if the property is defined but not an array', function () {
      const config = new Config({
        foo: 'bar'
      });
      expect(() => config.push('foo', 'baz')).to.throw('[push-array-only]');
    });
  });

  describe('.unshift()', function () {
    it('unshifts a value onto an array property', function () {
      const config = new Config({
        foo: ['bar']
      });
      config.unshift('foo', 'baz');
      expect(config.get('foo')).to.eql(['baz', 'bar']);
    });
    it('throws an error if the property is defined but not an array', function () {
      const config = new Config({
        foo: 'bar'
      });
      expect(() => config.unshift('foo', 'baz')).to.throw('[unshift-array-only]');
    });
  });

  describe('.addDefaults()', function () {
    it('deep merges the supplied data as defaults', function () {
      const config = new Config({
        foo: 'bar',
        baz: {
          nested: 'child'
        }
      });
      config.addDefaults({
        one: 2,
        baz: {
          nested: 'parent',
          another: 'prop'
        }
      });
      expect(config.data).to.eql({
        one: 2,
        foo: 'bar',
        baz: {
          nested: 'child',
          another: 'prop'
        }
      });
    });
    it('accepts a customizer to customize the defaults merging behaviour', function () {
      const defaultCustomizer = function (targetValue, defaultValue) {
        if (Array.isArray(targetValue) && Array.isArray(defaultValue)) {
          return targetValue.concat(defaultValue);
        }
      };
      const config = new Config({
        foo: 'bar',
        baz: [1, 2]
      });
      config.addDefaults({
        one: 2,
        baz: [3, 4]
      }, defaultCustomizer);
      expect(config.data).to.have.property('one').that.equals(2);
      expect(config.data).to.have.property('foo').that.equals('bar');
      expect(config.data).to.have.property('baz').that.has.same.members([1, 2, 3, 4]);
    });
    it('returns the config class instance', function () {
      const config = new Config({});
      expect(config.addDefaults({})).to.equal(config);
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

    it('attempts to require a bundled accessor by name if the handler argument is a string', function () {
      const packageLoader = require('./accessors/package-loader');
      const config = new Config();
      config.addAccessor('foo.bar', 'package-loader');
      const accessor = config.accessors.find(acc => acc.path === 'foo.bar');
      expect(accessor.handler).to.equal(packageLoader);
    });
  });

  describe('.validate()', function () {
    it('throws an error if the data does not match the provided schema', function () {
      const config = new Config({}, {schema});
      expect(() => config.validate({foo: '123'})).to.throw('[config-invalid]');
    });
    it('includes the propery path in the validation error', function () {
      try {
        const config = new Config({}, {schema});
        config.validate({foo: '124'});
      } catch (err) {
        expect(err.message.indexOf('data.foo')).to.be.greaterThan(-1);
      }
    });
  });

  describe('.clearCache()', function () {
    it('clears all cached results', function () {
      const config = new Config({
        foo: {
          bar: 'baz'
        }
      });

      const accessorSpy = sinon.spy(val => val);
      config.addAccessor('foo.bar', accessorSpy);

      expect(config.get('foo.bar')).to.equal('baz');
      expect(accessorSpy.calledOnce).to.equal(true);

      config.clearCache();

      expect(config.get('foo.bar')).to.equal('baz');
      expect(accessorSpy.calledTwice).to.equal(true);
    });
  });
});
