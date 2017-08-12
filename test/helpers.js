const Ajv = require('ajv');
const ajvKeywords = require('ajv-keywords');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const chaiAsPromised = require('chai-as-promised');
const schemaSchema = require('./schema-schema');

chai.use(chaiAsPromised);
chai.use(chaiSorted);

module.exports.expect = chai.expect;

module.exports.sinon = require('sinon');

module.exports.mockRequire = require('mock-require');

module.exports.validateSchema = function (testSchema) {
  const ajv = new Ajv();
  ajvKeywords(ajv);
  return ajv.validate(schemaSchema, testSchema);
};
