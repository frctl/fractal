const {Config} = require('@frctl/config');
const {expect, validateSchema} = require('../../../../../test/helpers');
const ConfigStore = require('./store');
const configSchema = require('./schema');

const addOns = ['commands', 'plugins', 'extensions', 'adapters'];

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

  describe('.defaultsCustomizer', function () {
    it('is a function', function () {
      expect(ConfigStore.defaultsCustomizer).to.be.a('function');
    });
    it('concats array sources if the key is in the add-ons list', function () {
      for (const addOn of addOns) {
        expect(ConfigStore.defaultsCustomizer([1, 2], [3, 4], addOn)).to.have.members([1, 2, 3, 4]);
        expect(ConfigStore.defaultsCustomizer({one: 1}, {two: 2}, addOn)).to.equal(undefined);
      }
      expect(ConfigStore.defaultsCustomizer([1, 2], [3, 4], 'foo')).to.equal(undefined);
    });
    it('casts undefined values to arrays if the key is in the add-ons list', function () {
      for (const addOn of addOns) {
        expect(ConfigStore.defaultsCustomizer(undefined, [3, 4], addOn)).to.have.members([3, 4]);
        expect(ConfigStore.defaultsCustomizer([1, 2], undefined, addOn)).to.have.members([1, 2]);
      }
      expect(ConfigStore.defaultsCustomizer(undefined, [3, 4], 'foo')).to.equal(undefined);
      expect(ConfigStore.defaultsCustomizer([1, 2], undefined, 'foo')).to.equal(undefined);
    });
  });
});

describe('Fractal config schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(configSchema)).to.equal(true);
  });
});
