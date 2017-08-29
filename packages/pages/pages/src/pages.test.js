const {join} = require('path');
const App = require('@frctl/app');
const {Fractal} = require('@frctl/fractal');
const {defaultsDeep} = require('@frctl/utils');
const {FileCollection, EmittingPromise} = require('@frctl/support');
const {expect} = require('../../../../test/helpers');
const pkg = require('../package.json');
const ConfigStore = require('./config/store');
const defaults = require('./config/defaults');
const Pages = require('./pages');

const fractal = new Fractal();
const config = {
  src: join(__dirname, '../../../../test/fixtures/pages'),
  presets: null
};

function makePages(customConfig) {
  return new Pages(new Fractal(), customConfig || config);
}

describe('Pages', function () {
  describe('constructor()', function () {
    it('wraps configuration data in a ConfigStore instance', () => {
      const pages = makePages();
      expect(pages.config.data).to.eql(defaultsDeep(config, defaults));
      expect(pages.config).to.be.instanceOf(ConfigStore);
    });
    it('throws an error if no Fractal instance is provided', () => {
      expect(() => new Pages({})).to.throw('[fractal-required]');
    });
    it('throws an error if invalid config data is provided', () => {
      expect(() => new Pages(fractal, {plugins: 'foo'})).to.throw('[config-invalid]');
    });
    it('does not throw an error if no config data is provided', () => {
      expect(() => new Pages(fractal)).to.not.throw();
    });
    it('extends App', () => {
      expect(makePages()).to.be.instanceOf(App);
    });
  });

  describe('.build()', function () {
    it('returns an EmittingPromise');
    it('Performs a full static build of the site');
  });

  describe('.serve()', function () {
    it('returns an EmittingPromise');
    it('Starts a webserver to serve the contents of the `dest` directory');
    it('Builds the appropriate pages on each request');
  });

  describe('.serveStatic()', function () {
    it('returns an EmittingPromise');
    it('Starts a webserver to serve the contents of the `dest` directory');
    it('Does not rebuild pages on subsequent requests even if the source files have changed');
  });

  describe('.getPages()', function () {
    it('returns an EmittingPromise', function () {
      const pages = makePages();
      expect(pages.getPages()).to.be.instanceOf(EmittingPromise);
    });
    it('resolves to a PageCollection instance');
  });

  describe('.toString()', function () {
    it('property describes the Pages instance', function () {
      const pages = makePages();
      expect(pages.toString()).to.equal('[object Pages]');
    });
  });

  describe('.version', function () {
    it('returns the version number from the package.json file', function () {
      const pages = makePages();
      expect(pages.version).to.equal(pkg.version);
    });
  });
});
