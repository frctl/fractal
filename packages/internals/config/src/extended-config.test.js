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
    presets: [
      parentPreset
    ]
  }
};

describe('ExtendedConfig', function () {
  it('extends the Config class', function () {
    expect(new ExtendedConfig()).to.be.instanceOf(Config);
  });
  describe('constructor', function () {
    it('adds the presets-resolver accessor for the `presets` property', function () {
      const config = new ExtendedConfig();
      expect(config.accessors.find(acc => acc.path === 'presets').handler.name).to.equal('presetsResolver');
    });
    it('applies config as defaults from all extended presets in the correct order', function () {
      const spy = sinon.spy(ExtendedConfig.prototype, 'addDefaults');
      new ExtendedConfig({
        presets: [
          preset
        ]
      });
      expect(spy.args[0][0].testName).to.equal('preset');
      expect(spy.args[1][0].testName).to.equal('parent');
      spy.restore();
    });
    it('omits extend keys from the defaults that are merged', function () {
      const spy = sinon.spy(ExtendedConfig.prototype, 'addDefaults');
      new ExtendedConfig({
        presets: [
          preset
        ]
      });
      expect(spy.args[0][0]).to.not.have.property('presets');
      expect(spy.args[1][0]).to.not.have.property('presets');
      spy.restore();
    });
    it('uses an empty object if no config prop is found for the preset', function () {
      expect(() => new ExtendedConfig({
        presets: [
          presetNoConfig
        ]
      })).to.not.throw();
    });
  });

  describe('.concatArrays', function () {
    it('is a function', function () {
      expect(ExtendedConfig.concatArrays).to.be.a('function');
    });
    it('concats array sources', function () {
      expect(ExtendedConfig.concatArrays([1, 2], [3, 4])).to.have.members([1, 2, 3, 4]);
      expect(ExtendedConfig.concatArrays({one: 1}, {two: 2})).to.equal(undefined);
    });
    it('casts undefined values to arrays', function () {
      expect(ExtendedConfig.concatArrays(undefined, [3, 4])).to.have.members([3, 4]);
      expect(ExtendedConfig.concatArrays([1, 2], undefined)).to.have.members([1, 2]);
    });
  });
});
