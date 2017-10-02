const {normalizeId, uniqueId} = require('@frctl/utils');
const check = require('check-types');
const Validator = require('../validator');
const schema = require('../../schema');
const VariantCollection = require('../collections/variant-collection');
const FileCollection = require('../collections/file-collection');
const Entity = require('./entity');
const Variant = require('./variant');

const assert = check.assert;

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
    return variants.find(id) || this.getDefaultVariant();
  }

  addVariant(props) {
    const isVariantInstance = check.maybe.instance(props, Variant);
    const isValidProp = check.maybe.object(props);
    const variantIds = this.getVariants().mapToArray(v => v.id);

    let config;

    assert(
      (isValidProp || isVariantInstance),
      `Component.addVariant: The 'props' argument must be a variant properties object or Variant instance [props-invalid]`,
      TypeError
    );

    if (isVariantInstance) {
      config = props;
    } else {
      config = Object.assign({}, props);
    }

    config.id = uniqueId(props.id || 'variant', variantIds);
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
    return this.get('default') ? this.getVariants().find(this.get('default')) : this.getVariants().first();
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
