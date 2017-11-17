
const {get} = require('lodash');
const check = require('check-types');
const {normalizeId, uniqueId, cloneDeep, titlize, slugify, toArray} = require('@frctl/utils');
const schema = require('../../schema');
const VariantCollection = require('../collections/variant-collection');
const FileCollection = require('../collections/file-collection');
const Entity = require('./entity');
const File = require('./file');

const managedProps = [
  'id',
  'src',
  'relative',
  'path',
  'files',
  'variants'
];

class Component extends Entity {

  constructor(props = {}){

    props = Object.assign({}, props, {
      tags: props.tags || [],
      required: props.requires || [],
    });

    super(props);

    this._src = File.from(props.src);
    this._id = slugify(props.id);
    this._files = new FileCollection(props.files || []);
    this._variants = new VariantCollection(props.variants || []);

    this.label = this.label || titlize(this.id);
  }

  get id(){
    return this._id;
  }

  set id(id){
    throw new Error('Component.id cannot be set after instantiation [invalid-set-id]');
  }

  get src(){
    return this._src;
  }

  set src(src){
    throw new Error('Component.src cannot be set after instantiation [invalid-set-src]');
  }

  get path(){
    return this.src.path;
  }

  set path(path){
    throw new Error(`Component.path is generated the from src file and cannot be set [invalid-set-path]`);
  }

  get relative(){
    return this.src.relative;
  }

  set relative(path){
    throw new Error(`Component.relative is generated the from src file and cannot be set [invalid-set-relative]`);
  }

  get files(){
    return this._files;
  }

  set files(files){
    throw new Error('Component.files cannot be set after instantiation [invalid-set-files]');
  }

  get variants(){
    return this._files;
  }

  set variants(variants){
    throw new Error('Component.variants cannot be set after instantiation [invalid-set-variants]');
  }

  get views(){
    const viewMatcher = this.getConfig('views.match', () => false); // default to no matches
    return this.files.filter(viewMatcher);
  }

  set views(views){
    throw new Error('Component.views cannot be set after instantiation [invalid-set-views]');
  }

  getFiles() {
    return this.files;
  }

  getVariants() {
    return this.variants;
  }

  getDefaultVariant() {
    return this.default ? this.getVariants().find(this.default) : this.variants.first();
  }

  getVariant(...args) {
    return args.length ? this.variants.find(...args) : this.getDefaultVariant();
  }

  getVariantOrDefault(id, throwIfNotFound = false) {
    if (throwIfNotFound) {
      return id ? this.variants.findOrFail(id) : this.getDefaultVariant();
    }
    return this.variants.find(id) || this.getDefaultVariant();
  }

  addVariant(variant){
    // TODO
  }

  getViews(){
    return this.views;
  }

  getView(...args) {
    return args.length ? this.getViews().find(...args) : this.views.first();
  }

  isDefaultVariant(variant) {
    return variant === this.getDefaultVariant();
  }

  toJSON() {
    const defaultVariant = this.getDefaultVariant();
    const json = super.toJSON();
    return Object.assign(json, {
      variants: json.variants.map(variant => {
        if (variant.id === defaultVariant.id) {
          variant.default = true;
        }
        return variant;
      })
    });
  }

  static fromSrc(src, files, config){
    check.assert.instanceOf(File, src, `Component.fromSrc - src must be a File instance`);
    return new Component({
      id: config.id || src.stem,
      label: config.label,
      default: config.default,
      src,
      files,
      config
    });
  }

  static isComponent(item) {
    return item instanceof Component;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && !managedProps.includes(name);
  }

  get [Symbol.toStringTag]() {
    return 'Component';
  }
}

Component.schema = schema.component;
managedProps.forEach(prop => Object.defineProperty(Component.prototype, prop, {enumerable: true}));

module.exports = Component;
