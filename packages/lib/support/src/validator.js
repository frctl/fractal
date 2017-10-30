const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');

class Validator extends Ajv {

  constructor(...args) {
    super(...args);
    ajvKeywords(this, ['instanceof', 'typeof', 'regexp']);
    const definition = require('ajv-keywords').get('instanceof').definition;
    definition.CONSTRUCTORS.File = require('./entities/file');
    definition.CONSTRUCTORS.Variant = require('./entities/variant');
    definition.CONSTRUCTORS.Component = require('./entities/component');
    definition.CONSTRUCTORS.Entity = require('./entities/entity');
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
