const {join} = require('path');

const debug = require('debug')('fractal:parser');
const check = require('check-types');
const globBase = require('glob-base');

const assert = check.assert;

const {toArray, normalizePath, getExt} = require('@frctl/utils');

const _sources = new WeakMap();

class Parser {
  /**
   * Insantiate a new Parser instance
   *
   * @return {Parser} The Parser instance
   */
  constructor(opts = {}) {
    debug('Instantiating a new Parser instance');

    _sources.set(this, []);

    if (opts.src) {
      this.addSource(opts.src);
    }
  }

  /**
   * Add a source.
   *
   * @return {Parser} The Parser instance
   */
  addSource(sources) {
    toArray(sources).forEach(src => {
      const srcInfo = getSrcInfo(src);
      _sources.get(this).push(srcInfo);
      debug(`Parser.addSource %o`, srcInfo);
    });
    return this;
  }

  /**
   * The target src directories
   * @return {Array}
   */
  get sources() {
    return _sources.get(this).slice(0);
  }
}

const getSrcInfo = src => {
  assert.string(src, `src must be a string [src-invalid]`);
  src = normalizePath(src);
  let srcInfo = globBase(src);
  if (!srcInfo.isGlob) {
    if (getExt(src)) {
      srcInfo.glob = '';
    } else {
      src = join(src, '**/*');
      srcInfo = globBase(src);
    }
  }
  srcInfo.src = src;
  return srcInfo;
};

module.exports = Parser;
