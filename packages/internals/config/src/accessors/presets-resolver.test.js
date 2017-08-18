const {expect, sinon, mockRequire} = require('../../../../../test/helpers');
const resolver = require('./presets-resolver');

const grandParentPreset = {
  name: 'grandparent-preset'
};

const parentPreset = {
  name: 'parent-preset',
  config: {
    presets: [
      grandParentPreset
    ]
  }
};

const firstPreset = {
  name: 'first-preset',
  config: {
    presets: [
      parentPreset
    ]
  }
};

const secondPreset = {
  name: 'second-preset',
  config: {
    presets: [
      firstPreset,
      parentPreset
    ]
  }
};

const thirdPreset = {
  name: 'third-preset',
  config: {
    presets: [
      parentPreset,
      firstPreset,
      secondPreset,
      grandParentPreset
    ]
  }
};

describe('presets-resolver', function () {
  it('exports a function', function () {
    expect(resolver).to.be.a('function');
  });

  it('loads items via the package loader', function () {
    const packages = [() => ({}), () => ({})];
    const spy = sinon.spy(v => v);
    mockRequire('./packages-loader', spy);
    mockRequire.reRequire('./presets-resolver')(packages);
    expect(spy.calledWith(packages)).to.equal(true);
    mockRequire.stop('./packages-loader');
  });

  it('recursively resolves and de-dupes `presets` into a flattened list of presets', function () {
    const presets = resolver([firstPreset, secondPreset]);
    expect(presets.map(preset => preset.name)).to.be.eql(['grandparent-preset', 'parent-preset', 'first-preset', 'second-preset']);
    const morePresets = resolver([thirdPreset, firstPreset, secondPreset]);
    expect(morePresets.map(preset => preset.name)).to.be.eql(['grandparent-preset', 'parent-preset', 'first-preset', 'second-preset', 'third-preset']);
  });
});
