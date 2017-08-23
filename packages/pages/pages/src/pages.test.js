const {join} = require('path');
const App = require('@frctl/app');
const {defaultsDeep} = require('@frctl/utils');
const {FileCollection, EmittingPromise} = require('@frctl/support');
const {expect} = require('../../../../test/helpers');
const pkg = require('../package.json');
const ConfigStore = require('./config/store');
const defaults = require('./config/defaults');
const Pages = require('./pages');

const config = {
  src: join(__dirname, '../../../../test/fixtures/pages'),
  presets: null
};

function makePages(customConfig) {
  return new Pages(customConfig || config);
}

describe.only('Pages', function () {
  describe('constructor()', function () {
    it('wraps configuration data in a ConfigStore instance', () => {
      const pages = makePages();
      expect(pages.config.data).to.eql(defaultsDeep(config, defaults));
      expect(pages.config).to.be.instanceOf(ConfigStore);
    });
    it('throws an error if invalid config data is provided', () => {
      expect(() => new Pages({plugins: 'foo'})).to.throw('[config-invalid]');
    });
    it('does not throw an error if no config data is provided', () => {
      expect(() => new Pages()).to.not.throw();
    });
    it('extends App', () => {
      expect(new Pages()).to.be.instanceOf(App);
    });
  });

  describe('.getPages()', function () {
    it('returns an EmittingPromise', function () {
      const pages = new Pages();
      expect(pages.getPages()).to.be.instanceOf(EmittingPromise);
    });
    it('resolves to a PageCollection instance');
  });

  describe('.getFiles()', function () {
    it('returns an EmittingPromise', function () {
      const pages = new Pages();
      expect(pages.getFiles()).to.be.instanceOf(EmittingPromise);
    });
    it('resolves to a FileCollection instance', async function () {
      const pages = new Pages();
      const files = await pages.getFiles();
      expect(files).to.be.instanceOf(FileCollection);
    });
  });

  describe('.toString()', function () {
    it('property describes the Pages instance', function () {
      const pages = new Pages();
      expect(pages.toString()).to.equal('[object Pages]');
    });
  });

  describe('.version', function () {
    it('returns the version number from the package.json file', function () {
      const pages = new Pages();
      expect(pages.version).to.equal(pkg.version);
    });
  });
});
