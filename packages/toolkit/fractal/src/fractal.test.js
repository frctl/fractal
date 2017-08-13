const {join} = require('path');
const {File, ComponentCollection, FileCollection} = require('@frctl/support');
const {expect} = require('../../../../test/helpers');
const pkg = require('../package.json');
const Fractal = require('./fractal');

const config = {
  src: join(__dirname, '../../../../test/fixtures/components'),
  extends: null,
  commands: [
    './test/fixtures/add-ons/command.js'
  ],
  adapters: [
    './test/fixtures/add-ons/adapter.js'
  ]
};

const view = new File({
  path: 'path/to/view.fjk',
  contents: Buffer.from('file contents')
});

describe('Fractal', function () {
  describe('constructor()', function () {
    it('accepts optional configuration data', () => {
      const fractal = new Fractal(config);
      expect(fractal.config).to.eql(config);
    });

    it('throws an error if invalid config data is provided', () => {
      expect(() => new Fractal({commands: 'foo'})).to.throw('[config-invalid]');
    });
  });

  describe('.get()', function () {
    it('retrieves a value from the config data', () => {
      const fractal = new Fractal(config);
      expect(fractal.get('foo')).to.equal(config.foo);
    });

    it('accepts a fallback argument which is returned if the property is undefined', () => {
      const fractal = new Fractal(config);
      const fallback = 'whoops!';
      expect(fractal.get('boop', fallback)).to.equal(fallback);
    });
  });

  describe('.parse()', function () {
    it('returns a Promise', function () {
      const fractal = new Fractal();
      expect(fractal.parse()).to.be.instanceOf(Promise);
    });
    it('resolves to an object with file and component collections', async function () {
      const fractal = new Fractal();
      const {components, files} = await fractal.parse();
      expect(components).to.be.instanceOf(ComponentCollection);
      expect(files).to.be.instanceOf(FileCollection);
    });
  });

  describe('.render()', function () {
    it('returns a Promise', function () {
      const fractal = new Fractal(config);
      expect(fractal.render(view)).to.be.instanceOf(Promise);
    });
    it('resolves to a string', async function () {
      const fractal = new Fractal(config);
      expect(await fractal.render(view)).to.be.a('string');
    });
  });

  describe('.getComponents()', function () {
    it('returns a Promise', function () {
      const fractal = new Fractal();
      expect(fractal.getComponents()).to.be.instanceOf(Promise);
    });
    it('resolves to a ComponentCollection instance', async function () {
      const fractal = new Fractal();
      const components = await fractal.getComponents();
      expect(components).to.be.instanceOf(ComponentCollection);
    });
  });

  describe('.getFiles()', function () {
    it('returns a Promise', function () {
      const fractal = new Fractal();
      expect(fractal.getComponents()).to.be.instanceOf(Promise);
    });
    it('resolves to a FileCollection instance', async function () {
      const fractal = new Fractal();
      const files = await fractal.getFiles();
      expect(files).to.be.instanceOf(FileCollection);
    });
  });

  describe('.toString()', function () {
    it('property describes the Fractal instance', function () {
      const fractal = new Fractal();
      expect(fractal.toString()).to.equal('[object Fractal]');
    });
  });

  describe('.version', function () {
    it('returns the version number from the package.json file', function () {
      const fractal = new Fractal();
      expect(fractal.version).to.equal(pkg.version);
    });
  });
});
