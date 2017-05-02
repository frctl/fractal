const expect = require('@frctl/utils/test').expect;
const Store = require('../src/store');
const Methods = require('../src/methods');

describe('Methods', function () {
  it('inherits from Store', function () {
    const methods = new Methods();
    expect(methods).to.be.instanceof(Store);
  });

  describe('.validate()', function () {
    it('throws an error if the method supplied does not validate', function () {
      const methods = new Methods();
      expect(() => methods.add('foo')).to.throw(TypeError, '[method-invalid]');
    });
    it('does not throw an erro when passed a valid commmand object', function () {
      const methods = new Methods();
      expect(() => methods.add({
        name: 'foo',
        handler() {}
      })).to.not.throw(TypeError, '[method-invalid]');
    });
  });
});
