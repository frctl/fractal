
const {get} = require('lodash');
const {assert} = require('check-types');
const {normalizeId, uniqueId, cloneDeep, titlize, slugify, toArray} = require('@frctl/utils');
const schema = require('../../schema');
const FileCollection = require('../collections/file-collection');
const ScenarioCollection = require('../collections/scenario-collection');
const VariantCollection = require('../collections/variant-collection');
const File = require('./file');
const Entity = require('./entity');
const Template = require('./template');
const Scenario = require('./scenario');

const managedProps = [
  'config',
  'src',
  'relative',
  'path',
  'files',
  'views',
  'variants',
  'scenarios'
];

class Component extends Entity {

  constructor(props = {}){
    if (Component.isComponent(props)) {
      return props;
    }

    props = Object.assign({}, props, {
      tags: props.tags || [],
      required: props.requires || [],
      files: new FileCollection(props.files),
      views: new FileCollection(props.views),
      variants: new VariantCollection(props.variants),
      scenarios: new ScenarioCollection(props.scenarios)
    });

    super(props);

    ['files','views','variants','scenarios'].forEach(prop => {
      this[`_${prop}`] = props[prop];
    });

    this._src = new File(props.src);
    this._id = slugify(props.id);
    this._config = cloneDeep(props.config || {});

    this.label = this.label || titlize(this.id);
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
    return this._views;
  }

  set views(views){
    throw new Error('Component.views cannot be set after instantiation [invalid-set-views]');
  }

  get config(){
    return cloneDeep(this._config);
  }

  set config(id){
    throw new Error(`${this.constructor.name}.config cannot be set after instantiation [invalid-set-config]`)
  }

  getConfig(path, fallback){
    if (path) {
      return cloneDeep(get(this._config, path, fallback));
    }
    return this._config;
  }

  getFiles() {
    return this.files;
  }

  getVariants() {
    return this.variants;
  }

  getDefaultVariant() {
    return this.default ? this.getVariants().find(this.defaultVariant) : this.variants.first();
  }

  getVariant(...args) {
    return args.length > 1 ? this.variants.find(...args) : this.getDefaultVariant();
  }

  getVariantOrDefault(id, throwIfNotFound = false) {
    if (throwIfNotFound) {
      return id ? this.variants.findOrFail(id) : this.getDefaultVariant();
    }
    return this.variants.find(id) || this.getDefaultVariant();
  }

  isDefaultVariant(variant) {
    return variant === this.getDefaultVariant();
  }

  getView(...args) {
    return args.length > 1 ? this.views.find(...args) : this.views.first();
  }

  getViews(){
    return this.views;
  }

  getScenario(...args){
    return args.length > 1 ? this.scenarios.find(...args) : this.getDefaultScenario();
  }

  getScenarios(){
    return this.scenarios;
  }

  getDefaultScenario(){
    return this.scenarios.first();
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

  static from(src, files = new FileCollection(), config = {}){
    if (!File.isFile(src)) {
      throw new TypeError(`Component.from - 'src' argument must be a File instance [src-invalid]`);
    }
    if (!FileCollection.isCollection(files)) {
      throw new TypeError(`Component.from - 'files' argument must be a FileCollection instance [files-invalid]`);
    }

    // Make the relative path of each file relative
    // to the Component source directory
    files = files.map(file => {
      file.base = src.path;
      return file;
    });

    const viewMatcher = get(config, 'views.match', () => false); // default to no matches
    const views = files.filter(viewMatcher).map(view => Template.fromView(view));

    const scenarios = new ScenarioCollection();
    const variants = new VariantCollection();

    for (const variant of get(config, 'variants', [])) {
      variants.push(Object.assign(variant, {
        views: views.clone()
      }));
    }

    for (const scenario of get(config, 'scenarios', [])) {
      scenarios.push(scenario);
    }

    const props = {
      id: config.id || src.stem,
      label: config.label,
      default: config.default,
    };

    return new Component(Object.assign(props, { src, files, config, views, variants, scenarios }));
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
