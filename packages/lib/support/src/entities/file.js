const fs = require('fs');
const {relative, basename, dirname, extname, join} = require('path');
const isBuffer = require('buffer').Buffer.isBuffer;
const replaceExt = require('replace-ext');
const cloneStats = require('clone-stats');
const cloneBuffer = require('clone-buffer');
const {assert} = require('check-types');
const slash = require('slash');
const {mapValues, pick, pickBy, omitBy, assign} = require('lodash');
const Vinyl = require('vinyl');
const {promisify, normalizePath, normalizeExt} = require('@frctl/utils');
const schema = require('../../schema');
const Entity = require('./entity');

const pfs = promisify(fs);
const managedProps = [
  'dirname',
  'extname',
  'basename',
  'contents',
  'base',
  'stem',
  'relative',
  'cwd',
  'path'
];

class File extends Entity {

  constructor(props = {}){

    props = Object.assign({}, props, {
      stat: props.stat || null,
      contents: props.contents || null,
    });

    super(props);

    this._cwd = normalizePath(props.cwd || process.cwd());

    ['base','path','contents'].forEach(prop => this.set(prop, props[prop]));
  }

  get path() {
    return this._path;
  }

  set path(path) {
    assert.nonEmptyString(path, `File.path - 'path' argument must be a string [path-invalid]`);
    this._path = normalizePath(path);
  }

  get cwd(){
    return this._cwd;
  }

  set cwd(cwd){
    throw new Error('File.cwd is read-only after initialisation [invalid-set-cwd]');
  }

  get relative(){
    return relative(this.base, this.path);
  }

  set relative(path){
    throw new Error('File.relative is generated from the base and path attributes. Do not modify it [invalid-set-relative]');
  }

  get basename(){
    return basename(this.path);
  }

  set basename(value){
    this.path = join(this.dirname, value);
  }

  get dirname(){
    return dirname(this.path);
  }

  set dirname(value){
    this.path = join(value, this.basename);
  }

  get extname(){
    return extname(this.path);
  }

  set extname(value){
    this.path = replaceExt(this.path, normalizeExt(value));
  }

  get stem(){
    return basename(this.path, this.extname);
  }

  set stem(value){
    this.path = join(this.dirname, value + this.extname);
  }

  get base(){
    return this._base || this.cwd;
  }

  set base(base){
    assert.maybe.nonEmptyString(base, `File.base - 'base' argument must be a non-empty string, or null/undefined [base-invalid]`);
    if (base === null || base === undefined) {
      return this._base = null;
    }
    base = normalizePath(base);
    this._base = base === this.cwd ? null : base;
  }

  get contents(){
    return this._contents;
  }

  set contents(contents){
    if (typeof contents === 'string') {
      contents = Buffer.from(contents);
    }
    if (!isBuffer(contents) && (contents !== null)) {
      throw new TypeError('File.contents can only be a Buffer, string or null [invalid-contents]');
    }
    this._contents = contents;
  }

  isDirectory() {
    if (this.contents !== null) {
      return false;
    }
    if (this.stat && typeof this.stat.isDirectory === 'function') {
      return this.stat.isDirectory();
    }
    return false;
  }

  toString() {
    return this.contents ? String(this.contents) : '';
  }

  toVinyl() {
    return new Vinyl(Object.assign({}, this.getCustomProps(), {
      cwd: this.cwd,
      path: this.path,
      base: this.base,
      stat: (this.stat ? cloneStats(this.stat) : null),
      contents: this.contents ? cloneBuffer(this.contents) : null
    }));
  }

  toJSON() {
    return omitBy(super.toJSON(), (value, key) => {
      return (value instanceof fs.Stats) || key === 'config';
    });
  }

  static isFile(item) {
    return item instanceof File;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && !managedProps.includes(name);
  }

  static async fromPath(path, opts = {}) {
    const stat = await pfs.stat(path);
    const contents = await pfs.readFile(path);
    const cwd = opts.cwd || process.cwd();
    const base = opts.base || cwd;
    return new File({path, cwd, stat, base, contents});
  }

  get [Symbol.toStringTag]() {
    return 'File';
  }

}

File.schema = schema.file;
managedProps.forEach(prop => Object.defineProperty(File.prototype, prop, {enumerable: true}));

module.exports = File;
