/* eslint import/no-unresolved: off */

const Module = require('module');
const {join} = require('path');
const {expect} = require('../../../../test/helpers');
const Loader = require('./loader');

const fixturesResolver = {
  alias: {
    '~': join(__dirname, '../test/fixtures')
  }
};

const fooTransform = {
  name: 'foo',
  match: ['.foo'],
  transform(contents, path) {
    return 'foo!';
  }
};

describe('Loader', function () {
  describe('.resolve()', function () {
    it('synchronously resolves the path with respect to the root', function () {
      const loader = new Loader();
      expect(loader.resolve('./loader', __dirname)).to.equal(join(__dirname, 'loader.js'));
    });

    it('resolved paths relative to the parent module if no root is supplied', function () {
      const loader = new Loader();
      const result = loader.resolve('../test/fixtures/config.js');
      expect(result).to.equal(require.resolve('../test/fixtures/config.js'));
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
      expect(loader.require('~/parent', __dirname)).to.not.equal(undefined);
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
    it('can require .js files', function () {
      const loader = new Loader(fixturesResolver);
      expect(loader.require('~/config.js')).to.eql({foo: 'bar'});
    });
    it('can require .json(5) files', function () {
      const loader = new Loader(fixturesResolver);
      expect(loader.require('~/config.json')).to.eql({foo: 'bar'});
    });
    it('can require .yml files', function () {
      const loader = new Loader(fixturesResolver);
      expect(loader.require('~/config.yml')).to.eql({foo: 'bar'});
    });
    it('doesn\'t break requiring NPM modules', function () {
      const loader = new Loader(fixturesResolver);
      expect(loader.require('~/config.js')).to.eql({foo: 'bar'});
      delete require.cache['@frctl/utils'];
      expect(() => require('@frctl/utils')).to.not.throw();
    });
  });

  describe('.requireFromString()', function () {
    it('can require commonjs module format strings', function () {
      const loader = new Loader(fixturesResolver);
      expect(loader.requireFromString(`module.exports = {foo:'bar'}`, 'foo.js')).to.eql({foo: 'bar'});
    });
    it('resolved child modules via the resolver', function () {
      const loader = new Loader(fixturesResolver);
      expect(loader.requireFromString(`const child = require('~/child'); module.exports = {foo:'bar'}`, 'foo.js')).to.eql({foo: 'bar'});
    });
    it('can require .json(5) files', function () {
      const loader = new Loader(fixturesResolver);
      expect(loader.requireFromString(`{foo:'bar'}`, 'foo.json')).to.eql({foo: 'bar'});
    });
    it('can require .yml files', function () {
      const loader = new Loader(fixturesResolver);
      expect(loader.requireFromString(`foo: bar`, 'foo.yml')).to.eql({foo: 'bar'});
    });
  });

  describe('.hook()', function () {
    it('monkeypatches the Module._load function', function () {
      const loader = new Loader();
      const originalLoad = Module._load;
      loader.hook();
      expect(Module._load).to.not.equal(originalLoad);
      loader.unhook();
    });
  });

  describe('.unhook()', function () {
    it('removes the monkeypatch from the Module._load function', function () {
      const loader = new Loader();
      const originalLoad = Module._load;
      loader.hook();
      loader.unhook();
      expect(Module._load).to.equal(originalLoad);
    });
  });

  describe('.addTransform()', function () {
    it('registers a transform object', function () {
      const loader = new Loader();
      loader.addTransform(fooTransform);
      expect(loader.transforms).to.include(fooTransform);
    });
  });

  describe('.transform()', function () {
    it('transforms the content using the first transform that matches the path extension', function () {
      const loader = new Loader();
      loader.addTransform(fooTransform);
      expect(loader.transform('asdasd', 'bar/file.foo')).to.equal('foo!');
    });
    it('returns the raw value if no matching transform is found', function () {
      const loader = new Loader();
      expect(loader.transform('asdasd', 'bar/file.foo')).to.equal('asdasd');
    });
  });
});
