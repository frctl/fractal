const Ajv = require('ajv');
const {expect} = require('../../../../test/helpers');
const Validator = require('./validator');

describe('Validator', function () {
  describe('extends Ajv', function () {
    const validator = new Validator();
    expect(validator).to.be.instanceOf(Ajv);
  });

  describe('Validator.validate()', function () {
    it('is a function', function () {
      expect(Validator.validate).to.be.a('function');
    });

    it('validates data against a schema', function () {
      const data = {foo: 'bar'};
      const schema = {
        properties: {
          foo: {
            type: 'string'
          }
        }
      };
      expect(Validator.validate(schema, data)).to.be.equal(true);
    });
  });
});
