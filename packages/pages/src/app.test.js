const {join} = require('path');
const App = require('@frctl/app');
const {Fractal} = require('@frctl/fractal');
const {defaultsDeep} = require('@frctl/utils');
// const {EmittingPromise} = require('@frctl/support');
const {expect} = require('../../../test/helpers');
const pkg = require('../package.json');
// const PageCollection = require('./support/page-collection');
const ConfigStore = require('./config/store');
const defaults = require('./config/defaults');
const Pages = require('./app');

// const fractal = new Fractal();
const config = {
  src: join(__dirname, '../../../test/fixtures/pages'),
  dest: './foo',
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
    it('throws an error if no config.dest value is set', () => {
      expect(() => new Pages(new Fractal(), {src: './foo'})).to.throw('[dest-missing]');
    });
    it('throws an error if invalid config data is provided', () => {
      expect(() => new Pages(new Fractal(), {plugins: 'foo', dest: './foo'})).to.throw('[config-invalid]');
    });
    it('extends App', () => {
      expect(makePages()).to.be.instanceOf(App);
    });
  });

  describe('.build()', function () {
    it('returns an EmittingPromise');
    it('Performs a full static build of the site');
  });

  //
  // describe('.getPages()', function () {
  //   it('returns an EmittingPromise', function () {
  //     const pages = makePages();
  //     expect(pages.getPages()).to.be.instanceOf(EmittingPromise);
  //   });
  //   it('resolves to a PageCollection instance', async function () {
  //     const pages = makePages();
  //     const result = await pages.getPages();
  //     expect(result).to.be.instanceOf(PageCollection);
  //   });
  // });

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
