const {get} = require('lodash');
const {normalizeId, uniqueId, defaultsDeep, cloneDeep} = require('@frctl/utils');
const check = require('check-types');
const Validator = require('../validator');
const schema = require('../../schema');
const VariantCollection = require('../collections/variant-collection');
const FileCollection = require('../collections/file-collection');
const Entity = require('./entity');
const Variant = require('./variant');

const assert = check.assert;

const _config = new WeakMap();
const _src = new WeakMap();
const _files = new WeakMap();
const _variants = new WeakMap();

class Component extends Entity {
  constructor(props) {
    if (Component.isComponent(props)) {
      return props;
    }
    Component.validate(props);

    const entityProps = Object.assign({
      id: get(props, 'config.id', props.src.stem)
    }, props.props || {});

    entityProps.id = normalizeId(entityProps.id);

    super(entityProps);

    this._setConfig(props.config || {});
    this._setSrc(props.src);
    this._setFiles(props.files);
    this._buildVariants(this.getConfig('variants', []));
  }

  getSrc() {
    return _src.get(this).clone();
  }

  getFiles() {
    return _files.get(this);
  }

  addFile(file) {
    _files.set(this, _files.get(this).push(file));
  }

  getVariants() {
    return _variants.get(this);
  }

  getVariant(id) {
    return _variants.get(this).find(id);
  }

  getVariantOrDefault(id) {
    const variants = _variants.get(this);
    return variants.find(id) || this.getDefaultVariant();
  }

  addVariant(config) {
    const isVariantInstance = check.maybe.instance(config, Variant);
    const isValidProp = check.maybe.object(config);
    const variantIds = this.getVariants().mapToArray(v => v.id);

    assert(
      (isValidProp || isVariantInstance),
      `Component.addVariant: The 'props' argument must be a variant config object or Variant instance [props-invalid]`,
      TypeError
    );

    if (!isVariantInstance) {
      config = cloneDeep(config);
    }

    config.id = uniqueId(config.id || 'variant', variantIds);
    config.component = this.get('id');

    if (!config.templates) {
      config.templates = {};
      this.getViews().filter(view => view.contents).forEach(view => {
        config.templates[view.basename] = view.contents.toString();
      });
    }

    const variant = Variant.from(config);
    _variants.set(this, _variants.get(this).push(variant));
    return this;
  }

  getDefaultVariant() {
    return this.getConfig('default') ? this.getVariants().find(this.getConfig('default')) : this.getVariants().first();
  }

  getViews() {
    const viewMatcher = this.getConfig('views.match', () => false); // default to no matches
    const viewSorter = view => (view.extname === this.getConfig('views.default')) ? 0 : 1;
    return this.getFiles().filter(viewMatcher).sortBy(viewSorter);
  }

  getView(...args) {
    return args ? this.getViews().find(...args) : this.getViews().first();
  }

  getConfig(path, fallback){
    if (path) {
      return cloneDeep(get(_config.get(this), path, fallback));
    }
    return cloneDeep(_config.get(this));
  }

  _setConfig(config) {
    _config.set(this, config);
  }

  _setSrc(src) {
    _src.set(this, src);
  }

  _setFiles(files) {
    _files.set(this, FileCollection.from(files));
  }

  _validateOrThrow(/* props */) {
    return true;
  }

  _buildVariants(variants = []) {
    _variants.set(this, new VariantCollection());

    if (variants.length === 0) {
      variants.push({
        id: 'default',
        component: this.get('id')
      });
    }

    for (const variant of variants) {
      this.addVariant(variant);
    }
  }

  clone() {
    return new this.constructor({
      src: this.getSrc(),
      files: this.getFiles(),
      config: this.getConfig(),
      props: this.getData()
    });
  }

  get relative() {
    return _src.get(this).relative;
  }

  get [Symbol.toStringTag]() {
    return 'Component';
  }

  static validate(props) {
    Validator.assertValid(props, schema.component, `Component.constructor: The properties provided do not match the schema of a component [properties-invalid]`);
  }

  static isComponent(item) {
    return item instanceof Component;
  }

}

module.exports = Component;
