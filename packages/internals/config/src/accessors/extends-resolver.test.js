const {expect, sinon, mockRequire} = require('../../../../../test/helpers');
const resolver = require('./extends-resolver');

const grandParentPreset = {
  name: 'grandparent-preset'
};

const parentPreset = {
  name: 'parent-preset',
  config: {
    extends: [
      grandParentPreset
    ]
  }
};

const firstPreset = {
  name: 'first-preset',
  config: {
    extends: [
      parentPreset
    ]
  }
};

const secondPreset = {
  name: 'second-preset',
  config: {
    extends: [
      firstPreset,
      parentPreset
    ]
  }
};

const thirdPreset = {
  name: 'third-preset',
  config: {
    extends: [
      parentPreset,
      firstPreset,
      secondPreset,
      grandParentPreset
    ]
  }
};

describe('extends-resolver', function () {
  it('exports a function', function () {
    expect(resolver).to.be.a('function');
  });

  it('loads items via the package loader', function () {
    const packages = [() => ({}), () => ({})];
    const spy = sinon.spy(v => v);
    mockRequire('./packages-loader', spy);
    mockRequire.reRequire('./extends-resolver')(packages);
    expect(spy.calledWith(packages)).to.equal(true);
    mockRequire.stop('./packages-loader');
  });

  it('recursively resolves and de-dupes `extends` into a flattened list of presets', function () {
    const presets = resolver([firstPreset, secondPreset]);
    expect(presets.map(preset => preset.name)).to.be.eql(['grandparent-preset', 'parent-preset', 'first-preset', 'second-preset']);
    const morePresets = resolver([thirdPreset, firstPreset, secondPreset]);
    expect(morePresets.map(preset => preset.name)).to.be.eql(['grandparent-preset', 'parent-preset', 'first-preset', 'second-preset', 'third-preset']);
  });
});
