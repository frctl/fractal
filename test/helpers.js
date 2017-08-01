const chai = require('chai');
const chaiSorted = require('chai-sorted');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(chaiSorted);

module.exports.expect = chai.expect;

module.exports.sinon = require('sinon');
