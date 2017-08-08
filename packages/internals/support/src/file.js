const fs = require('fs');
const {mapValues, pick, pickBy, assign} = require('lodash');
const Vinyl = require('vinyl');
const {promisify} = require('@frctl/utils');

const pfs = promisify(fs);
const getters = ['relative', 'path', 'extname', 'base', 'basename', 'contents', 'dirname', 'stem', 'cwd'];

class File extends Vinyl {

  clone() {
    return super.clone(true);
  }

  toJSON() {
    const vinylProps = pick(this, getters);
    const customProps = pickBy(this, (value, key) => {
      return !key.startsWith('_') && typeof value !== 'function' && !(value instanceof fs.Stats);
    });
    return mapValues(assign(vinylProps, customProps), (val, key, obj) => {
      if (Buffer.isBuffer(val)) {
        return val.toString();
      }
      return val;
    });
  }

  toString() {
    return this.contents ? this.contents.toString() : '';
  }

  get [Symbol.toStringTag]() {
    return 'File';
  }

  static isFile(item) {
    return item instanceof File;
  }

  static from(props) {
    return new this(props);
  }

  static async fromPath(path, opts = {}) {
    const stat = await pfs.stat(path);
    const contents = await pfs.readFile(path);
    const cwd = opts.cwd || process.cwd();
    const base = opts.base || cwd;
    return new File({path, cwd, stat, base, contents});
  }

}

module.exports = File;
