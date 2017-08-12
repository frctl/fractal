const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');

class Validator extends Ajv {

  constructor(...args) {
    super(...args);
    ajvKeywords(this, ['instanceof', 'typeof', 'regexp']);
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
