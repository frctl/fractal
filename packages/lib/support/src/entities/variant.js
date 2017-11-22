const {titlize, slugify, cloneDeep} = require('@frctl/utils');
const {assert} = require('check-types');
const schema = require('../../schema');
const FileCollection = require('../collections/file-collection');
const Entity = require('./entity');

const managedProps = ['views'];

class Variant extends Entity {

  constructor(props) {
    if (Variant.isVariant(props)) {
      return props;
    }
    super(props);

    this._id = slugify(props.id);
    this._views = new FileCollection(props.views);

    this.label = props.label || titlize(this.id);
  }

  get views(){
    return this._views;
  }

  set views(views){
    throw new Error('Variant.views cannot be set after instantiation [invalid-set-views]');
  }

  static isVariant(item) {
    return item instanceof Variant;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && !managedProps.includes(name);
  }

  get [Symbol.toStringTag]() {
    return 'Variant';
  }

}

Variant.schema = schema.variant;
managedProps.forEach(prop => Object.defineProperty(Variant.prototype, prop, {enumerable: true}));

module.exports = Variant;
