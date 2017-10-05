const {extname} = require('path');
const Validator = require('../validator');
const schema = require('../../schema');
const Entity = require('./entity');

class Template extends Entity {

  constructor(props) {
    super(props);
    this.defineGetter('extname', () => extname(this.get('filename')));
  }

  static isTemplate(item) {
    return item instanceof Template;
  }

  get [Symbol.toStringTag]() {
    return 'Template';
  }

  _validateOrThrow(props) {
    Validator.assertValid(props, schema.template, `Template.constructor: The properties provided do not match the schema of a template [properties-invalid]`);
  }

}

module.exports = Template;
