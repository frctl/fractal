const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');

class Validator extends Ajv {

  constructor(...args) {
    super(...args);
    ajvKeywords(this, ['instanceof', 'typeof', 'regexp']);
    const definition = require('ajv-keywords').get('instanceof').definition;
    definition.CONSTRUCTORS.File = require('./entities/file');
    definition.CONSTRUCTORS.Entity = require('./entities/entity');
    definition.CONSTRUCTORS.Variant = require('./entities/variant');
    definition.CONSTRUCTORS.Template = require('./entities/template');
    definition.CONSTRUCTORS.Scenario = require('./entities/scenario');
    definition.CONSTRUCTORS.Component = require('./entities/component');
    definition.CONSTRUCTORS.Collection = require('./collections/collection');
    definition.CONSTRUCTORS.FileCollection = require('./collections/file-collection');
    definition.CONSTRUCTORS.TemplateCollection = require('./collections/template-collection');
    definition.CONSTRUCTORS.EntityCollection = require('./collections/entity-collection');
    definition.CONSTRUCTORS.VariantCollection = require('./collections/variant-collection');
    definition.CONSTRUCTORS.ComponentCollection = require('./collections/component-collection');
  }

  static assertValid(data, schema, errorMessage) {
    const validator = new Validator({allErrors: true});
    if (!validator.validate(schema, data)) {
      const message = errorMessage || 'Schema validation failed';
      throw new TypeError(`${message}: ${validator.errorsText()}`);
    }
    return true;
  }

}

module.exports = Validator;
