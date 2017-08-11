const Ajv = require('ajv');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(chaiSorted);

module.exports.expect = chai.expect;

module.exports.sinon = require('sinon');

module.exports.mockRequire = require('mock-require');

module.exports.validateSchema = function (testSchema) {
  const schemaSchema = require('./schema-schema');
  const ajv = new Ajv();
  return ajv.validate(schemaSchema, testSchema);
};
