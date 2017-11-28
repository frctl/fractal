const {titlize, slugify} = require('@frctl/utils');
const schema = require('../../schema');
const TemplateCollection = require('../collections/template-collection');
const Entity = require('./entity');
const File = require('./file');
const Template = require('./template');

const managedProps = ['views'];

class Variant extends Entity {

  constructor(props) {
    if (Variant.isVariant(props)) {
      return props;
    }

    props = Object.assign(props, {
      views: props.views || []
    });

    super(props);

    this._id = slugify(props.id);
    this._views = new TemplateCollection();

    props.views.forEach(view => this.addView(view));

    this.label = props.label || titlize(this.id);
  }

  get views() {
    return this._views;
  }

  set views(views) {
    throw new Error('Variant.views cannot be set after instantiation [invalid-set-views]');
  }

  getViews() {
    return this.views;
  }

  getView(...args) {
    return args.length > 0 ? this.views.find(...args) : this.views.first();
  }

  addView(view) {
    view = File.isFile(view) ? view.clone() : new File(view);
    view = Template.fromFile(view);
    this._views = this._views.push(view);
    return this;
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
