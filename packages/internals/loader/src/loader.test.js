/* eslint import/no-unresolved: off */

const {join} = require('path');
const {File} = require('@frctl/support');
const {expect, sinon} = require('../../../../test/helpers');
const Loader = require('./loader');

describe('Loader', function () {
  describe('.resolve()', function () {
    it('synchronously resolves the path with respect to the root', function () {
      const loader = new Loader();
      expect(loader.resolve('./loader', __dirname)).to.equal(join(__dirname, 'loader.js'));
    });

    it('resolved paths relative to the cwd if no root is supplied', function () {
      const loader = new Loader();
      const result = loader.resolve('./test/fixtures/add-ons/plugin');
      expect(result).to.equal(join(process.cwd(), 'test/fixtures/add-ons/plugin.js'));
    });

    it('throws an error if the path cannot be resolved', function () {
      const loader = new Loader();
      expect(() => loader.resolve('./foo', __dirname)).to.throw('[resolver-error]');
    });

    it('falls back to native node resolution if the path cannot be resolved', function () {
      const loader = new Loader();
      expect(loader.resolve('fs')).to.equal(require.resolve('fs'));
    });

    it('resolves paths against any aliases supplied in config', function () {
      const loader = new Loader({
        alias: {
          '@@': __dirname,
          '!': process.cwd()
        }
      });
      expect(loader.resolve('@@/loader.js')).to.equal(join(__dirname, 'loader.js'));
      expect(loader.resolve('!/README.md')).to.equal(join(process.cwd(), 'README.md'));
    });
  });

  describe('.require()', function () {
    it('requires a module after resolving the path', function () {
      const loader = new Loader();
      const spy = sinon.spy(loader, 'resolve');
      loader.require('./loader', __dirname);
      expect(spy.calledWith('./loader', __dirname)).to.equal(true);
    });

    it('throws an error if the module cannot be required', function () {
      const loader = new Loader();
      expect(() => loader.require('./foo', __dirname)).to.throw();
    });
    it('correctly resolves child dependencies', function () {
      const loader = new Loader({
        alias: {
          '~': join(__dirname, '../test/fixtures')
        }
      });
      expect(() => loader.require('~/parent', __dirname)).to.not.throw();
    });
    it('un-patches the require method when done', function () {
      const loader = new Loader({
        alias: {
          '~': join(__dirname, '../test/fixtures')
        }
      });
      loader.require('~/parent', __dirname);
      expect(() => require('~/parent')).to.throw();
    });
  });

  describe('.loadFile()', function () {
    it('throws an error if the file argument is not a File instance', function () {
      const loader = new Loader();
      expect(() => loader.loadFile({})).to.throw('[file-invalid]');
    });
    it('loads the contents of .js files', function () {
      const loader = new Loader();
      const file = new File({
        path: 'path/to/file.js',
        contents: Buffer.from('module.exports = {foo:"bar"}')
      });
      expect(loader.loadFile(file)).to.eql({foo: 'bar'});
    });
    it('loads the contents of .json(5) files', function () {
      const loader = new Loader();
      const file = new File({
        path: 'path/to/file.json',
        contents: Buffer.from('{foo:"bar"}')
      });
      expect(loader.loadFile(file)).to.eql({foo: 'bar'});
    });
  });
});
