const {Config} = require('@frctl/config');
const {expect, validateSchema} = require('../../../../test/helpers');
const ConfigStore = require('./store');
const configSchema = require('./schema');

const addOns = ['plugins', 'transforms'];

function factory(data) {
  return new ConfigStore(data);
}

describe('Pages config store', function () {
  describe('factory()', function () {
    it('returns a Config instance', function () {
      const config = factory({});
      expect(config).to.be.instanceOf(Config);
    });
  });

  describe('.accessors', function () {
    it('includes an package loader array accessor for each add-on type', function () {
      for (const key of addOns) {
        const config = factory({});
        const accessor = config.accessors.find(acc => acc.path === key);
        expect(accessor).to.be.an('object').with.property('handler').that.has.property('name').that.equals('packagesLoader');
      }
    });
  });
});

describe('Pages config schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(configSchema)).to.equal(true);
  });
});
