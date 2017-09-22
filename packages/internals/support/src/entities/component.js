const {normalizeName} = require('@frctl/utils');
const Validator = require('../validator');
const schema = require('../../schema');
const VariantCollection = require('../collections/variant-collection');
const FileCollection = require('../collections/file-collection');
const Entity = require('./entity');

const _src = new WeakMap();
const _files = new WeakMap();
const _variants = new WeakMap();

class Component extends Entity {
  constructor(props) {
    if (Component.isComponent(props)) {
      return props;
    }
    Component.validate(props);

    const config = Object.assign({
      name: normalizeName(props.src.stem)
    }, props.config);

    super(config);

    this._setSrc(props.src);
    this._setFiles(props.files);
    this._buildVariants(config.variants);
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

  getVariant(name) {
    return _variants.get(this).find(name);
  }

  getVariantOrDefault(name) {
    const variants = _variants.get(this);
    return variants.find(name) || variants.getDefault();
  }

  addVariant(variant) {
    _variants.set(this, _variants.get(this).push(variant));
  }

  getDefaultVariant() {
    return _variants.get(this).getDefault();
  }

  getViews() {
    let views = new FileCollection();
    const viewMatcher = this.get('views.match');
    if (viewMatcher) {
      views = this.getFiles().filter(viewMatcher);
    }
    return views;
  }

  getView(...args) {
    return this.getViews().find(...args);
  }

  getAssets() {
    let assets = new FileCollection();
    const assetMatcher = this.get('assets.match');
    if (assetMatcher) {
      assets = this.getFiles().filter(assetMatcher);
    }
    return assets;
  }

  _setSrc(src, files) {
    _src.set(this, src);
  }

  _setFiles(files) {
    _files.set(this, FileCollection.from(files));
  }

  _validateOrThrow(/* props */) {
    return true;
  }

  _buildVariants(variants = []) {
    let variantCollection = new VariantCollection(variants, this.get('name'));

    if (!variantCollection.hasDefault()) {
      variantCollection = variantCollection.push({
        name: 'default',
        default: true
      });
    }

    _variants.set(this, variantCollection);
  }

  clone() {
    const cloned = new this.constructor({
      src: this.getSrc(),
      files: this.getFiles(),
      config: this._config
    });
    for (let [key, value] of Object.entries(this._data)) {
      cloned.set(key, value);
    }
    return cloned;
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
