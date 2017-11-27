
const {get} = require('lodash');
const {cloneDeep, titlize, slugify} = require('@frctl/utils');
const schema = require('../../schema');
const FileCollection = require('../collections/file-collection');
const TemplateCollection = require('../collections/template-collection');
const ScenarioCollection = require('../collections/scenario-collection');
const VariantCollection = require('../collections/variant-collection');
const File = require('./file');
const Entity = require('./entity');
const Variant = require('./variant');
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

  constructor(props = {}) {
    if (Component.isComponent(props)) {
      return props;
    }

    props = Object.assign({}, props, {
      tags: props.tags || [],
      required: props.requires || [],
      views: props.views || [],
      files: props.files || [],
      variants: props.variants || [],
      scenarios: props.scenarios || []
    });

    super(props);

    this._src = new File(props.src);
    this._id = slugify(props.id);
    this._config = cloneDeep(props.config || {});

    this._files = new FileCollection();
    this._views = new TemplateCollection();
    this._variants = new VariantCollection();
    this._scenarios = new ScenarioCollection();

    props.files.forEach(file => this.addFile(file));
    props.views.forEach(view => this.addView(view));
    props.variants.forEach(variant => this.addVariant(variant));
    props.scenarios.forEach(scenario => this.addScenario(scenario));

    // always need one variant, if none are supplied then create one
    if (this.variants.length === 0) {
      this.addVariant({id: 'default'});
    }

    this.label = this.label || titlize(this.id);
  }

  get src() {
    return this._src;
  }

  set src(src) {
    throw new Error('Component.src cannot be set after instantiation [invalid-set-src]');
  }

  get path() {
    return this.src.path;
  }

  set path(path) {
    throw new Error(`Component.path is generated the from src file and cannot be set [invalid-set-path]`);
  }

  get relative() {
    return this.src.relative;
  }

  set relative(path) {
    throw new Error(`Component.relative is generated the from src file and cannot be set [invalid-set-relative]`);
  }

  get files() {
    return this._files;
  }

  set files(files) {
    throw new Error('Component.files cannot be set after instantiation [invalid-set-files]');
  }

  get views() {
    return this._views;
  }

  set views(views) {
    throw new Error('Component.views cannot be set after instantiation [invalid-set-views]');
  }

  get variants() {
    return this._variants;
  }

  set variants(variants) {
    throw new Error('Component.variants cannot be set after instantiation [invalid-set-variants]');
  }

  get scenarios() {
    return this._scenarios;
  }

  set scenarios(scenarios) {
    throw new Error('Component.scenarios cannot be set after instantiation [invalid-set-scenarios]');
  }

  get config() {
    return cloneDeep(this._config);
  }

  set config(id) {
    throw new Error(`${this.constructor.name}.config cannot be set after instantiation [invalid-set-config]`);
  }

  getConfig(path, fallback) {
    if (path) {
      return cloneDeep(get(this._config, path, fallback));
    }
    return this._config;
  }

  getFiles() {
    return this.files;
  }

  addFile(file) {
    file = File.isFile(file) ? file.clone() : new File(file);
    file.base = this.path; // Make the rel path of the file relative to the Component source dir
    this._files = this._files.push(file);
    return this;
  }

  getView(...args) {
    return args.length > 0 ? this.views.find(...args) : this.views.first();
  }

  getViews() {
    return this.views;
  }

  addView(view) {
    const file = File.isFile(view) ? view.clone() : new File(view);
    const tpl = Template.fromFile(file);
    tpl.base = this.path;
    if (!this.files.find({path: file.path})) {
      this.addFile(file); // if it doesn't exist in the files collection, add it in
    }
    this.variants.forEach(variant => variant.addView(tpl));
    this._views = this._views.push(tpl);
    return this;
  }

  getVariants() {
    return this.variants;
  }

  getVariant(...args) {
    return args.length > 0 ? this.variants.find(...args) : this.getDefaultVariant();
  }

  getDefaultVariant() {
    return this.variants.first(); // TODO: Allow specifying custom default via config
  }

  isDefaultVariant(variant) {
    return variant === this.getDefaultVariant();
  }

  addVariant(variant) {
    if (!Variant.isVariant(variant)) {
      variant.views = this.views.clone();
      variant = new Variant(variant);
    }
    this._variants = this._variants.push(variant);
    return this;
  }

  getScenario(...args) {
    return args.length > 0 ? this.scenarios.find(...args) : this.getDefaultScenario();
  }

  getScenarios() {
    return this.scenarios;
  }

  getDefaultScenario() {
    return this.scenarios.first();
  }

  addScenario(scenario) {
    if (!Scenario.isScenario(scenario)) {
      scenario = new Scenario(scenario);
    }
    this._scenarios = this._scenarios.push(scenario);
    return this;
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

  static from(src, files = [], config = {}) {
    src = new File(src);
    if (!FileCollection.isCollection(files) && !Array.isArray(files)) {
      throw new TypeError(`Component.from - 'files' argument must be an array or FileCollection instance [files-invalid]`);
    }

    files = new FileCollection(files);

    const viewMatcher = get(config, 'views.match', () => false); // default to no matches

    const props = {
      id: config.id || src.stem,
      label: config.label,
      variants: get(config, 'variants', []),
      scenarios: get(config, 'scenarios', []),
      views: files.filter(viewMatcher)
    };

    return new Component(Object.assign(props, {src, files, config}));
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
