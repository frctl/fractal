/* eslint import/no-dynamic-require: off,  no-unused-expressions: off */

const {writeFileSync, mkdirSync} = require('fs');
const {tmpdir} = require('os');
const {join} = require('path');
const {capitalize} = require('lodash');
const {FileCollection, Collection, EmittingPromise} = require('@frctl/support');
const {Config} = require('@frctl/config');
const {Parser} = require('@frctl/parser');
const {Loader} = require('@frctl/loader');
const Cache = require('node-cache');
const {FSWatcher} = require('chokidar');
const {expect, sinon} = require('../../../../test/helpers');
const App = require('./app');

const config = {
  src: join(__dirname, '../../../../test/fixtures/components'),
  plugins: [],
  transforms: []
};

const tmp = join(tmpdir(), Date.now().toString());

mkdirSync(tmp);

function writeFile(name, contents) {
  writeFileSync(join(tmp, name), contents);
}

function makeApp(customConfig) {
  return new App(customConfig || config);
}

describe('App', function () {
  describe('constructor()', function () {
    it('accepts configuration data', () => {
      const app = makeApp();
      expect(app.config.data).to.eql(config);
    });
    it('does not throw an error if no config data is provided', () => {
      expect(() => new App()).to.not.throw();
    });
    it('sets the dirty flag to true', () => {
      const app = new App();
      expect(app.dirty).to.equal(true);
    });
  });

  describe('.get()', function () {
    it('retrieves a value from the config data', () => {
      const app = makeApp();
      expect(app.get('foo')).to.equal(config.foo);
    });
    it('accepts a fallback argument which is returned if the property is undefined', () => {
      const app = makeApp();
      const fallback = 'whoops!';
      expect(app.get('boop', fallback)).to.equal(fallback);
    });
  });

  describe('.set()', function () {
    it('sets a value in the config data', () => {
      const app = makeApp();
      app.set('foo.bar', 'baz');
      expect(app.get('foo.bar')).to.equal('baz');
    });
    it('sets the dirty flag', () => {
      const app = makeApp();
      app.dirty = false;
      app.set('foo.bar', 'baz');
      expect(app.dirty).to.equal(true);
    });
  });

  describe('.parse()', function () {
    it('returns an EmittingPromise', function () {
      const app = new App();
      expect(app.parse()).to.be.instanceOf(EmittingPromise);
    });
    it('resolves to an object with a file collection', async function () {
      const app = new App();
      const {files} = await app.parse();
      expect(files).to.be.instanceOf(FileCollection);
    });
    it('uses the cached result if valid', async function () {
      const app = new App();
      const spy = sinon.spy(app.cache, 'get');
      const collections = await app.parse();
      expect(spy.called).to.equal(true);
      expect(spy.returned(collections)).to.equal(false);
      spy.reset();
      const cachedCollections = await app.parse();
      expect(spy.returned(cachedCollections)).to.equal(true);
      spy.restore();
    });
    it('rejects if an error is thrown by the parser', async function () {
      const app = new App();
      const stub = sinon.stub(app, 'getParser').callsFake(function () {
        return {
          run() {
            return Promise.reject(new Error('oops!'));
          }
        };
      });
      let tested = false;
      try {
        await app.parse();
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        tested = true;
        stub.restore();
      }
      expect(tested).to.equal(true);
    });
  });

  describe('.watch()', function () {
    let app;
    let watcher;
    beforeEach(function () {
      app = new App({
        src: [tmp + '/**/*']
      });
      watcher = app.watch();
    });
    afterEach(function () {
      watcher.close();
    });
    it('returns a chokidar instance', function () {
      expect(watcher).to.be.instanceOf(FSWatcher);
    });
    it('returns the same instance if called twice', function () {
      const sameWatcher = app.watch();
      expect(watcher).to.equal(sameWatcher);
    });
    it('sets the chokidar opts correctly', function () {
      expect(watcher.options.ignoreInitial).to.equal(true);
      expect(watcher.options.cwd).to.equal(process.cwd());
    });
    it('sets the dirty flag when the filesystem changes', function (done) {
      if (process.env.IS_CI) {
        this.skip();
      }
      watcher.on('all', function () {
        expect(app.dirty).to.equal(true);
        done();
      });
      app.dirty = false;
      watcher.on('ready', () => writeFile('foo.js'));
    });
  });

  describe('.unwatch()', function () {
    let app;
    let watcher;
    beforeEach(function () {
      app = new App({
        src: [tmp + '/**/*']
      });
      watcher = app.watch();
    });
    afterEach(function () {
      watcher.close();
    });
    it('closes the chokidar instance', function () {
      app.unwatch();
      expect(watcher.closed).to.equal(true);
    });
    it('removes the instance so the next call to watch() initializes a fresh one', function () {
      app.unwatch();
      const newWatcher = app.watch();
      expect(watcher).to.not.equal(newWatcher);
    });
  });

  for (const addOn of ['plugin', 'transform']) {
    const method = `add${capitalize(addOn)}`;
    describe(`.${method}()`, function () {
      it(`adds a ${addOn} to the ${addOn}s config array`, function () {
        const app = new App({presets: null});
        expect(app.get(`${addOn}s`)).to.be.an('array').and.have.property('length').which.equals(0);
        app[method](`./test/fixtures/add-ons/${addOn}`);
        expect(app.get(`${addOn}s`).length).equal(1);
      });
      it(`marks the app instance as dirty`, function () {
        const app = new App({presets: null});
        app.dirty = false;
        app[method](`./test/fixtures/add-ons/${addOn}`);
        expect(app.dirty).to.equal(true);
      });
      it(`returns the App instance`, function () {
        const app = new App({presets: null});
        expect(app[method](`./test/fixtures/add-ons/${addOn}`)).to.equal(app);
      });
    });
  }

  describe('.require()', function () {
    it('calls the loader with the expected args', () => {
      const app = makeApp({
        alias: {
          '~': join(__dirname, '../test/fixtures')
        }
      });
      const spy = sinon.spy(app.loader, 'require');
      app.require('~/parent');
      expect(spy.calledWith('~/parent', __dirname)).to.equal(true);
    });
    it('throws an error if the file is not found', () => {
      const app = makeApp();
      expect(() => app.require('~/parent')).to.throw('[resolver-error]');
    });
  });

  describe('.getParser()', function () {
    it('returns a new Parser instance', function () {
      const app = new App();
      const parser = app.getParser();
      expect(parser).to.be.instanceOf(Parser);
      expect(app.getParser()).to.not.equal(parser);
    });
    it('initialises the parser with src, plugins and transforms from the config', function () {
      const app = new App({
        src: ['/foo'],
        plugins: [
          {
            name: 'foo-plugin',
            transform: 'tests',
            handler: function () {}
          }
        ],
        transforms: [
          {
            name: 'tests',
            transform: function () {
              return new Collection();
            }
          }
        ]
      });
      const parser = app.getParser();
      expect(parser.sources.map(src => src.base)[0]).to.equal('/foo');
      expect(parser.getTransform('tests')).to.have.property('name').that.equals('tests');
      expect(parser.getTransform('tests').plugins.items.map(plugin => plugin.name)).to.include('foo-plugin');
    });
  });

  describe('.dirty', function () {
    it('gets and sets the dirty property', function () {
      const app = new App();
      app.dirty = false;
      expect(app.dirty).to.equal(false);
      app.dirty = true;
      expect(app.dirty).to.equal(true);
    });
    it('clears the cache when set to true', function () {
      const app = new App();
      const spy = sinon.spy(app.cache, 'del');
      app.dirty = true;
      expect(spy.called).to.equal(true);
      spy.reset();
      app.dirty = false;
      expect(spy.called).to.equal(false);
      spy.restore();
    });
  });

  describe('.cache', function () {
    it('returns the application cache instance', function () {
      const app = new App();
      expect(app.cache).to.be.instanceof(Cache);
    });
  });

  describe('.loader', function () {
    it('returns the loader instance', function () {
      const app = new App();
      expect(app.loader).to.be.instanceof(Loader);
    });
  });

  describe('.config', function () {
    it('returns the config instance', function () {
      const app = new App({
        foo: 'bar'
      });
      expect(Config.isConfig(app.config)).to.equal(true);
    });
  });
});
