const {Config} = require('@frctl/config');
const {expect, validateSchema} = require('../../../../../test/helpers');
const ConfigStore = require('./store');
const configSchema = require('./schema');

const addOns = ['commands', 'plugins', 'extensions', 'adapters', 'transforms', 'extensions'];

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
    extends: [
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
    extends: [
      parentPreset,
      firstPreset
    ],
    plugins: [
      plugins.second
    ]
  }
};

const configData = {
  extends: [
    firstPreset,
    secondPreset
  ]
};

function factory(data) {
  return new ConfigStore(data);
}

describe('Fractal config initializer', function () {
  describe('factory()', function () {
    it('returns a Config instance', function () {
      const config = factory({});
      expect(config).to.be.instanceOf(Config);
    });

    it('correctly merges config from presets', function () {
      const config = factory(configData);
      expect(config.data.plugins.map(p => p.name)).to.eql(['plugin-parent', 'plugin-first', 'plugin-second']);
    });
  });

  describe('.accessors', function () {
    it('includes an package loader array accessor for each add-on type', function () {
      expect(ConfigStore.accessors.length).to.equal(addOns.length);
      for (const key of addOns) {
        const accessor = ConfigStore.accessors.find(acc => acc.path === key);
        expect(accessor).to.be.an('object').with.property('handler').that.equals('packages-loader');
      }
    });
  });
});

describe('Fractal config schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(configSchema)).to.equal(true);
  });
});
