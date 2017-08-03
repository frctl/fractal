/* eslint handle-callback-err: off, no-unused-expressions: off */

const {expect} = require('../../../../test/helpers');
const Config = require('./config');

describe('Config', function () {
  describe('constructor', function () {
    it('throws an error if a non-object config property is provided', function () {
      expect(() => new Config('foo')).to.throw(TypeError, '[config-invalid]');
      expect(() => new Config({prop: 'val'})).to.not.throw(TypeError);
    });

    it('sets the data from the config argument', function () {
      const data = {prop: 'val'};
      const config = new Config(data);
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
      const config = new Config(data);
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
      const data = {};
      const config = new Config(data);
      config.set('test.this', 'foo');
      expect(config.get('test.this')).to.equal('foo');
    });
  });
});
