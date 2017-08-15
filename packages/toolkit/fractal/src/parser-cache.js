const {isInteger} = require('lodash');

const _expiry = new WeakMap();
const _cache = new WeakMap();

class ParserCache {

  constructor(expiry = false) {
    if (expiry && !isInteger(expiry)) {
      throw new TypeError(`ParserCache.constructor - expiry must be an integer or falsey [expiry-invalid]`);
    }
    _expiry.set(this, expiry);
  }

  get() {
    const cached = _cache.get(this);
    if (cached && Date.now() < cached.timestamp + this.ttl) {
      // if cache expiry is disabled or current timestamp is
      // less than the cached timestamp plus the expiry time
      // then return cached contents
      return cached.collections;
    }
    return null;
  }

  set(collections) {
    _cache.set(this, {
      collections,
      timestamp: Date.now()
    });
    return this;
  }

  clear() {
    _cache.set(this, null);
  }

  get ttl() {
    const expiry = _expiry.get(this);
    if (!expiry && expiry !== 0) {
      return 60 * 60 * 24 * 365; // don't expire
    }
    return expiry;
  }

}

module.exports = ParserCache;
