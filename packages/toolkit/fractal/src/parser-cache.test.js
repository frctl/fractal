const {expect} = require('../../../../test/helpers');
const ParserCache = require('./parser-cache');

describe('ParserCache', function () {
  describe('constructor()', function () {
    it('accepts an expiry argument to set the ttl', function () {
      const cache = new ParserCache(1000);
      expect(cache.ttl).to.equal(1000);
    });
    it('throws an error on invalid expiry argument', function () {
      expect(() => new ParserCache('foo')).to.throw('[expiry-invalid]');
    });
  });

  describe('.get()', function () {
    it('returns null if there is nothing cached', function () {
      const cache = new ParserCache();
      expect(cache.get()).to.equal(null);
    });
    it('returns the cached collections if valid', function () {
      const cache = new ParserCache();
      const collections = {foo: 'bar'};
      cache.set(collections);
      expect(cache.get()).to.equal(collections);
    });
    it('returns null if the cache has expired', function (done) {
      const cache = new ParserCache(100);
      const collections = {foo: 'bar'};
      cache.set(collections);
      expect(cache.get()).to.equal(collections);
      setTimeout(function () {
        expect(cache.get()).to.equal(null);
        done();
      }, 101);
    });
  });

  describe('.set()', function () {
    it('sets the cached value', function () {
      const cache = new ParserCache();
      const collections = {foo: 'bar'};
      const collections2 = {foo: 'baz'};
      expect(cache.get()).to.equal(null);
      cache.set(collections);
      expect(cache.get()).to.equal(collections);
      cache.set(collections2);
      expect(cache.get()).to.equal(collections2);
    });
  });

  describe('.clear()', function () {
    it('clears the cache', function () {
      const cache = new ParserCache();
      const collections = {foo: 'bar'};
      cache.set(collections);
      expect(cache.get()).to.equal(collections);
      cache.clear();
      expect(cache.get()).to.equal(null);
    });
  });

  describe('.ttl', function () {
    it('sets a value greater than a day if the expiry is disabled', function () {
      for (const expiry of [null, false]) {
        const cache = new ParserCache(expiry);
        expect(cache.ttl).to.be.greaterThan(60 * 60 * 24);
      }
    });
    it('returns the expiry time set via the constructor', function () {
      for (const expiry of [1000, 2000]) {
        const cache = new ParserCache(expiry);
        expect(cache.ttl).to.equal(expiry);
      }
    });
  });
});
