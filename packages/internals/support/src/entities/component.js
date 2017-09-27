const {normalizeId} = require('@frctl/utils');
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
      id: normalizeId(props.src.stem)
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

  getVariant(id) {
    return _variants.get(this).find(id);
  }

  getVariantOrDefault(id) {
    const variants = _variants.get(this);
    return variants.find(id) || variants.getDefault();
  }

  addVariant(variant) {
    _variants.set(this, _variants.get(this).push(variant));
  }

  getDefaultVariant() {
    return _variants.get(this).getDefault();
  }

  getViews() {
    const viewMatcher = this.get('views.match', () => false); // default to no matches
    const viewSorter = view => {
      if (view.extname === this.get('views.default')) {
        return 0;
      }
      return 1;
    };
    return this.getFiles().filter(viewMatcher).sortBy(viewSorter);
  }

  getView(...args) {
    return args ? this.getViews().find(...args) : this.getViews().first();
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
    let variantCollection = new VariantCollection(variants, this._proxy);

    if (!variantCollection.hasDefault()) {
      variantCollection = variantCollection.push({
        id: 'default',
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
