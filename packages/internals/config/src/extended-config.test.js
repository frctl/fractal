/* eslint no-new: off */

const {expect, sinon} = require('../../../../test/helpers');
const Config = require('./config');
const ExtendedConfig = require('./extended-config');

const presetNoConfig = {
  name: 'noconfig-preset'
};

const parentPreset = {
  name: 'parent-preset',
  config: {
    testName: 'parent'
  }
};

const preset = {
  name: 'preset',
  config: {
    testName: 'preset',
    extends: [
      parentPreset
    ]
  }
};

describe('ExtendedConfig', function () {
  it('extends the Config class', function () {
    expect(new ExtendedConfig()).to.be.instanceOf(Config);
  });
  describe('constructor', function () {
    it('adds the extends-resolver accessor for the `extends` property', function () {
      const config = new ExtendedConfig();
      expect(config.accessors.find(acc => acc.path === 'extends').handler.name).to.equal('extendsResolver');
    });
    it('applies config as defaults from all extended presets in the correct order', function () {
      const spy = sinon.spy(ExtendedConfig.prototype, 'defaults');
      new ExtendedConfig({
        extends: [
          preset
        ]
      });
      expect(spy.args[0][0].testName).to.equal('preset');
      expect(spy.args[0][1].testName).to.equal('parent');
      spy.restore();
    });
    it('omits extend keys from the defaults that are merged', function () {
      const spy = sinon.spy(ExtendedConfig.prototype, 'defaults');
      new ExtendedConfig({
        extends: [
          preset
        ]
      });
      expect(spy.args[0][0]).to.not.have.property('extends');
      expect(spy.args[0][1]).to.not.have.property('extends');
      spy.restore();
    });
    it('uses an empty object if no config prop is found for the preset', function () {
      expect(() => new ExtendedConfig({
        extends: [
          presetNoConfig
        ]
      })).to.not.throw();
    });
  });
});
