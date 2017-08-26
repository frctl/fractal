/* eslint import/no-unresolved: off */

const {join} = require('path');
const Resolver = require('enhanced-resolve/lib/Resolver');
const {ResolverFactory} = require('enhanced-resolve');
const {expect, sinon} = require('../../../../test/helpers');
const Loader = require('./loader');

describe('Loader', function () {
  describe('constructor()', function () {
    it('passes configuration options to the resolver', function () {
      const spy = sinon.spy(ResolverFactory, 'createResolver');
      // eslint-disable-next-line no-unused-vars
      const loader = new Loader({
        fileSystem: 'foo'
      });
      expect(spy.args[0][0].fileSystem).to.equal('foo');
      spy.restore();
    });
  });

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

  describe('.resolver', function () {
    it('returns the internal resolver instance', function () {
      const loader = new Loader();
      expect(loader.resolver).to.be.instanceOf(Resolver);
    });
  });
});
