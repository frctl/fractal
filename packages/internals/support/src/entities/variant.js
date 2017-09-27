const Validator = require('../validator');
const schema = require('../../schema');
const Collection = require('../collections/collection');
const Entity = require('./entity');

const _templates = new WeakMap();
const _componentId = new WeakMap();

class Variant extends Entity {

  constructor(props) {
    super(props.config);
    this._setTemplates(Collection.from(props.templates || []));
    this._setComponentId(props.component);
  }

  getComponentId(){
    return _componentId.get(this);
  }

  getTemplate(finder) {
    if (!finder) {
      return this.getTemplates().first();
    }
    if (typeof finder === 'string') {
      return this.getTemplates().find(tpl => tpl.extname === finder);
    }
    return this.getTemplates().find(finder);
  }

  getTemplates() {
    return _templates.get(this);
  }

  _setTemplates(templates) {
    _templates.set(this, templates);
  }

  _setComponentId(componentId) {
    _componentId.set(this, componentId);
  }

  _validateOrThrow(props) {
    Validator.assertValid(props, schema.variant, `Variant.constructor: The properties provided do not match the schema of a variant [properties-invalid]`);
  }

  clone() {
    const cloned = new this.constructor({
      templates: this.getTemplates(),
      config: this._config
    });
    for (let [key, value] of Object.entries(this._data)) {
      cloned.set(key, value);
    }
    return cloned;
  }

  static isVariant(item) {
    return item instanceof Variant;
  }

  get [Symbol.toStringTag]() {
    return 'Variant';
  }

}

module.exports = Variant;
