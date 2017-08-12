const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');

class Validator extends Ajv {

  constructor(...args) {
    super(...args);
    ajvKeywords(this, ['instanceof', 'typeof', 'regexp']);
  }

  static validate(schema, data) {
    const validator = new Validator();
    return validator.validate(schema, data);
  }

}

module.exports = Validator;
