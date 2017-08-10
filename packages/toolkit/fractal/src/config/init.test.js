const Config = require('@frctl/config');
const {expect} = require('../../../../../test/helpers');
const factory = require('./init');

const plugins = {
  parent: {
    name: 'plugin-parent'
  },
  first: {
    name: 'plugin-first'
  },
  second: {
    name: 'plugin-second'
  }
};

const parentPreset = {
  name: 'parent-preset',
  config: {
    plugins: [
      plugins.parent
    ]
  }
};

const firstPreset = {
  name: 'first-preset',
  config: {
    presets: [
      parentPreset
    ],
    plugins: [
      plugins.first
    ]
  }
};

const secondPreset = {
  name: 'second-preset',
  config: {
    presets: [
      parentPreset,
      firstPreset
    ],
    plugins: [
      plugins.second
    ]
  }
};

const configData = {
  presets: [
    firstPreset,
    secondPreset
  ]
};

// for each preset,
// - ignore if the preset has already been applied
// - add the preset config as defaults
// - if the preset has a parent preset, then resolve and merge the parent preset's config data

describe('config creator', function () {
  describe('factory()', function () {
    it('returns a Config instance', () => {
      const config = factory({});
      expect(config).to.be.instanceOf(Config);
    });

    it('correctly merges config from presets', () => {
      const config = factory(configData);
      expect(config.data.plugins.map(p => p.name)).to.eql(['plugin-parent', 'plugin-first', 'plugin-second']);
    });
  });

  describe('accessors', function () {
    it('includes an package loader array accessor for each add-on type', () => {
      const addOns = ['presets', 'commands', 'plugins', 'extensions', 'adapters'];
      expect(factory.accessors.length).to.equal(addOns.length);
      for (const key of addOns) {
        const accessor = factory.accessors.find(acc => acc.path === key);
        expect(accessor).to.be.an('object').with.property('handler').that.equals('packages-loader');
      }
    });
  });
});
