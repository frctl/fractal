const {Config} = require('@frctl/config');
const {expect, validateSchema} = require('../../../../../test/helpers');
const ConfigStore = require('./store');
const configSchema = require('./schema');

const addOns = ['plugins', 'engines', 'transforms'];

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
      for (const key of addOns) {
        const config = factory({});
        const accessor = config.accessors.find(acc => acc.path === key);
        expect(accessor).to.be.an('object').with.property('handler').that.has.property('name').that.equals('packagesLoader');
      }
    });
  });
});

describe('Fractal config schema', function () {
  it('is a valid schema', function () {
    expect(validateSchema(configSchema)).to.equal(true);
  });
});
