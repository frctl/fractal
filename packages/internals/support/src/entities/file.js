const fs = require('fs');
const path = require('path');
const isBuffer = require('buffer').Buffer.isBuffer;
const replaceExt = require('replace-ext');
const cloneStats = require('clone-stats');
const cloneBuffer = require('clone-buffer');
const {assert} = require('check-types');
const {mapValues, pick, pickBy, omit, assign} = require('lodash');
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
  'history',
  'stat',
  'cwd',
  'path'];

class File extends Entity {

  constructor(props = {}) {
    if (File.isFile(props)) {
      return props;
    }
    File.validate(props);
    props = Object.assign({}, props, {
      stat: props.stat || null,
      contents: props.contents || null,
      cwd: normalizePath((props.cwd !== undefined && props.cwd !== null) ? props.cwd : process.cwd())
    });
    super(props);
    this._defineGettersAndSetters(props);
  }

  isDirectory() {
    if (!(this.get('contents') === null)) {
      return false;
    }
    const stat = this.get('stat');
    if (stat && typeof stat.isDirectory === 'function') {
      return stat.isDirectory();
    }

    return false;
  }

  toString() {
    return this.get('contents') ? this.get('contents').toString() : '';
  }

  toVinyl() {
    return new Vinyl(Object.assign({}, this.getData(), {
      cwd: this.get('cwd'),
      path: this.get('path'),
      base: this.get('base'),
      stat: (this.get('stat') ? cloneStats(this.get('stat')) : null),
      history: this.get('history').slice(),
      contents: this.get('contents') ? cloneBuffer(this.get('contents')) : null
    }));
  }

  clone() {
    const config = Object.assign({}, this.getData(), {
      cwd: this.get('cwd'),
      path: this.get('path'),
      base: this.get('base'),
      stat: (this.get('stat') ? cloneStats(this.get('stat')) : null),
      history: this.get('history').slice(),
      contents: this.get('contents') ? cloneBuffer(this.get('contents')) : null
    });
    return new this.constructor(config);
  }

  _defineGettersAndSetters(props) {
    this._initHistory(props.history, props.path);

    this.defineGetter('path', (value, entity) => {
      return this._getPath();
    });
    this.defineSetter('path', (value, entity) => {
      return this._setPath(value);
    });

    this.defineGetter('base', (value, entity) => {
      return value || this.get('cwd');
    });

    this.defineSetter('base', (value, entity) => {
      return this._setBase(value);
    });

    this.defineSetter('cwd', (value, entity) => {
      assert(false, 'File.cwd is read-only after initialisation [invalid-set-cwd]', TypeError);
    });

    this.defineSetter('contents', (value, entity) => {
      return this._setContents(value);
    });

    this.defineGetter('relative', (value, entity) => {
      return path.relative(this.get('base'), this.get('path'));
    });
    this.defineSetter('relative', (value, entity) => {
      assert(false, 'File.relative is generated from the base and path attributes. Do not modify it [invalid-set-relative]', TypeError);
    });

    this.defineGetter('basename', (value, entity) => {
      return path.basename(this._getPath());
    });
    this.defineSetter('basename', (value, entity) => {
      return this._setPath(path.join(this.get('dirname'), value));
    });

    this.defineGetter('dirname', (value, entity) => {
      return path.dirname(this._getPath());
    });
    this.defineSetter('dirname', (value, entity) => {
      this._setPath(path.join(value, this.get('basename')));
    });

    this.defineGetter('extname', (value, entity) => {
      return path.extname(this._getPath());
    });
    this.defineSetter('extname', (value, entity) => {
      this._setPath(replaceExt(this._getPath(), value));
    });

    this.defineGetter('stem', (value, entity) => {
      return path.basename(this._getPath(), this.get('extname'));
    });
    this.defineSetter('stem', (value, entity) => {
      this._setPath(path.join(this.get('dirname'), value + this.get('extname')));
    });

    this.set('base', props.base);
  }

  _getPath() {
    const history = this.get('history');
    return history[history.length - 1];
  }
  _setPath(path) {
    assert.nonEmptyString(path, `File.path - 'path' argument must be a string [path-invalid]`);
    if (!path) {
      return;
    }
    path = normalizePath(path);
    if (path && (path !== this._getPath())) {
      this._addHistory(path);
    }
    return path;
  }

  _setBase(base) {
    if (base === null || base === undefined) {
      return null;
    }
    assert.maybe.nonEmptyString(base, `File.base - 'base' argument must be a non-empty string, or null/undefined [base-invalid]`);
    base = normalizePath(base);
    if (base !== this.get('cwd')) {
      return base;
    }
    return null;
  }

  _initHistory(history, path) {
    history = Array.prototype.slice.call(history || []);
    if (path) {
      history.push(path);
    }
    this.set('history', []);
    history.forEach(path => this._setPath(path));
  }

  _addHistory(path, init = false) {
    let history = this.get('history');
    history.push(path);
    this.set('history', history);
  }

  _setContents(contents) {
    if (!isBuffer(contents) && (contents !== null)) {
      throw new TypeError('File.contents can only be a Buffer or null [invalid-contents]');
    }
    return contents;
  }

  toJSON() {
    const vinylProps = pick(this.getData(), getters);
    const customProps = pickBy(this.getData(), (value, key) => {
      return !key.startsWith('_') && typeof value !== 'function' && !(value instanceof fs.Stats);
    });
    const vals = mapValues(assign(vinylProps, customProps), (val, key, obj) => {
      if (Buffer.isBuffer(val)) {
        return val.toString();
      }
      if (val && typeof val.toJSON === 'function') {
        return val.toJSON();
      }
      return val;
    });
    return Object.assign({}, vals, {
      basename: this.get('basename'),
      dirname: this.get('dirname'),
      extname: this.get('extname'),
      relative: this.get('relative'),
      stem: this.get('stem')
    });
  }

  inspect(depth, opts) {
    let data = omit(this.toJSON(), ['stat', 'history'])
    return `${this[Symbol.toStringTag]} ${JSON.stringify(data)}`;
  }

  get [Symbol.toStringTag]() {
    return 'File';
  }

  static isFile(item) {
    return item instanceof File;
  }

  static validate(props) {
    Validator.assertValid(props, schema.file, `File.constructor: The properties provided do not match the schema of a File [properties-invalid]`);
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
