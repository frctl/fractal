const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const chaiAsPromised = require('chai-as-promised');
const schemaSchema = require('./schema/schema');

chai.use(chaiAsPromised);
chai.use(chaiSorted);

function validate(schema, data) {
  const ajv = new Ajv();
  ajvKeywords(ajv, ['typeof', 'instanceof', 'regexp']);
  return ajv.validate(schema, data);
}

function validateSchema(testSchema) {
  return validate(schemaSchema, testSchema);
}

module.exports.expect = chai.expect;
module.exports.sinon = require('sinon');

module.exports.validate = validate;
module.exports.validateSchema = validateSchema;
