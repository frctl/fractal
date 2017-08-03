/* eslint handle-callback-err: off, no-unused-expressions: off */

const {expect} = require('../../../../test/helpers');
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

    it('validates input data against a schema, if supplied', function () {
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
});
