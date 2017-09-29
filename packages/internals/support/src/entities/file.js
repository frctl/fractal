const fs = require('fs');
const {assert} = require('check-types');
const {mapValues, omit, pick, pickBy, assign} = require('lodash');
const Vinyl = require('vinyl');
const {promisify, normalizePath} = require('@frctl/utils');
const schema = require('../../schema');
const Validator = require('../validator');
const Entity = require('./entity');

const pfs = promisify(fs);
const getters = [
  'dirname',
  'extname',
  'basename',
  'contents',
  'base',
  'stem',
  'relative',
  'cwd',
  'path'];

const protectedProps = [
  'cwd',
  'base',
  'contents',
  'history'
];

const _cwds = new WeakMap();
const _bases = new WeakMap();

class File extends Entity {

  constructor(props = {}) {
    if (File.isFile(props)) {
      return props;
    }
    File.validate(props);
    props = Object.assign({}, props, {
      stat: props.stat || null
    });
    super(omit(props, protectedProps));
    this._defineGettersAndSetters(props);
  }

  _defineGettersAndSetters(props) {

    this._initHistory(props.history, props.path);
    this._setContents(props.contents || null);
    this._setCwd(props.cwd || process.cwd());
    this._setBase(props.base);

    this.defineGetter('path', (value, entity) => {
      return this._getPath();
    });
    this.defineGetter('base', (value, entity) => {
      return _bases.get(this) || _cwds.get(this);
    });
    this.defineGetter('cwd', (value, entity) => {
      return _cwds.get(this);
    });
  }

  _getPath() {
    const history = this.get('history');
    return history[history.length - 1];
  }
  _setPath(path) {
    assert.string(path, `File.path - 'path' argument must be a string [path-invalid]`)
    path = normalizePath(path);

    if (path && path !== this._getPath()) {
      this._addHistory(path);
    }
  }

  _setBase(base) {
    if (base === null || base === undefined) {
      _bases.delete(this);
      return;
    }
    assert.maybe.string(base, `File.base - 'base' argument must be a string [base-invalid]`);
    base = normalizePath(base);
    if (base !== _cwds.get(this)) {
      _bases.set(this, base);
    } else {
      _bases.delete(this);
    }
  }

  _setCwd(cwd) {
    assert.string(cwd, `File.cwd - 'cwd' argument must be a string [cwd-invalid]`);
    _cwds.set(this, normalizePath(cwd));
  }

  _initHistory(history, path) {
    history = Array.prototype.slice.call(history || []);
    if (path) {
      history.push(path);
    }
    this.set('history', []);
    history.forEach(path => this._setPath(path));
  }

  _addHistory(path, init=false) {
    let history = this.get('history');
    history.push(path);
    this.set('history', history);
  }
  _setContents(contents) {
    this.set('contents', contents);
  }



  // clone() {
  //   return super.clone({deep: true, path: this.path});
  // }
  //
  // toJSON() {
  //   const vinylProps = pick(this, getters);
  //   const customProps = pickBy(this, (value, key) => {
  //     return !key.startsWith('_') && typeof value !== 'function' && !(value instanceof fs.Stats);
  //   });
  //   return mapValues(assign(vinylProps, customProps), (val, key, obj) => {
  //     if (Buffer.isBuffer(val)) {
  //       return val.toString();
  //     }
  //     return val;
  //   });
  // }
  //
  // toString() {
  //   return this.contents ? this.contents.toString() : '';
  // }

  get[Symbol.toStringTag]() {
    return 'File';
  }

  static isFile(item) {
    return item instanceof File;
  }

  static validate(props) {
    Validator.assertValid(props, schema.file, `File.constructor: The properties provided do not match the schema of a File [properties-invalid]`);
  }

  // static from(props) {
  //   return new this(props);
  // }

  // static async fromPath(path, opts = {}) {
  //   const stat = await pfs.stat(path);
  //   const contents = await pfs.readFile(path);
  //   const cwd = opts.cwd || process.cwd();
  //   const base = opts.base || cwd;
  //   return new File({path, cwd, stat, base, contents});
  // }

}

module.exports = File;
