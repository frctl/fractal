const Ajv = require('ajv');
const {expect} = require('../../../../test/helpers');
const Validator = require('./validator');

describe('Validator', function () {
  describe('extends Ajv', function () {
    const validator = new Validator();
    expect(validator).to.be.instanceOf(Ajv);
  });

  describe('Validator.assertValid()', function () {
    it('is a function', function () {
      expect(Validator.assertValid).to.be.a('function');
    });

    it('throws an error if the data is not valid', function () {
      const schema = {
        properties: {
          foo: {
            type: 'integer'
          }
        }
      };
      expect(() => Validator.assertValid({foo: 'bar'}, schema)).to.throw(TypeError);
      expect(() => Validator.assertValid({foo: 123}, schema)).to.not.throw(TypeError);
    });
    it('supports supplying a custom error message', function () {
      const schema = {
        properties: {
          foo: {
            type: 'integer'
          },
          bar: {
            type: 'array'
          }
        }
      };
      expect(() => Validator.assertValid({foo: 'bar'}, schema, '[foo]')).to.throw(TypeError, '[foo]');
    });
  });
});
