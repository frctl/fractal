const {writeFileSync, mkdirSync} = require('fs');
const {tmpdir} = require('os');
const {join} = require('path');
const {File, ComponentCollection, FileCollection, EmittingPromise, Component, Variant, Collection} = require('@frctl/support');
const {defaultsDeep} = require('@frctl/utils');
const {Renderer} = require('@frctl/renderer');
const {Parser} = require('@frctl/parser');
const Cache = require('node-cache');
const {FSWatcher} = require('chokidar');
const {expect, sinon} = require('../../../../test/helpers');
const pkg = require('../package.json');
const defaults = require('./config/defaults');
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

const files = new FileCollection([
  new File({path: 'components/@test-component'}),
  new File({
    name: 'view',
    path: 'components/@test-component/view.fjk',
    contents: Buffer.from('component!')
  })
]);

const components = new ComponentCollection([
  new Component({
    name: 'test-component',
    src: files.find({stem: '@test-component'}),
    files: new FileCollection([
      files.find({stem: 'view'})
    ]),
    variants: new Collection([
      new Variant({
        name: 'default',
        default: true,
        component: 'test-component',
        context: {
          foo: 'bar'
        }
      })
    ])
  })
]);

const parserOutput = {components, files};

const tmp = join(tmpdir(), Date.now().toString());

mkdirSync(tmp);

function writeFile(name, contents) {
  writeFileSync(join(tmp, name), contents);
}

function makeFractal(customConfig) {
  return new Fractal(customConfig || config);
}

describe('Fractal', function () {
  describe('constructor()', function () {
    it('accepts configuration data', () => {
      const fractal = makeFractal();
      expect(fractal.config).to.eql(defaultsDeep(config, defaults));
    });

    it('throws an error if invalid config data is provided', () => {
      expect(() => new Fractal({commands: 'foo'})).to.throw('[config-invalid]');
    });

    it('does not throw an error if no config data is provided', () => {
      expect(() => new Fractal()).to.not.throw();
    });

    it('sets the dirty flag to true', () => {
      const fractal = new Fractal();
      expect(fractal.dirty).to.equal(true);
    });
  });

  describe('.get()', function () {
    it('retrieves a value from the config data', () => {
      const fractal = makeFractal();
      expect(fractal.get('foo')).to.equal(config.foo);
    });

    it('accepts a fallback argument which is returned if the property is undefined', () => {
      const fractal = makeFractal();
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
    it('uses the cached result if valid', async function () {
      const fractal = new Fractal();
      const spy = sinon.spy(fractal.cache, 'get');
      const collections = await fractal.parse();
      expect(spy.called).to.equal(true);
      expect(spy.returned(collections)).to.equal(false);
      spy.reset();
      const cachedCollections = await fractal.parse();
      expect(spy.returned(cachedCollections)).to.equal(true);
      spy.restore();
    });
  });

  describe('.render()', function () {
    it('returns a Promise', function () {
      const fractal = makeFractal();
      expect(fractal.render(view)).to.be.instanceOf(EmittingPromise);
    });
    it('resolves to a string', async function () {
      const fractal = makeFractal();
      expect(await fractal.render(view)).to.be.a('string');
    });
    it('rejects if no adapters have been added', function () {
      const fractal = makeFractal({
        extends: null
      });
      const result = fractal.render(view);
      expect(result).to.be.instanceOf(EmittingPromise);
      return expect(result).to.be.rejectedWith(Error, '[no-adapters]');
    });
    it('rejects the specified adapter cannot be found', function () {
      const fractal = makeFractal();
      return expect(fractal.render(view, {}, {
        adapter: 'foo'
      })).to.eventually.be.rejectedWith(Error, '[adapter-not-found]');
    });
    it('rejects the target is not a view, component or variant', function () {
      const fractal = makeFractal();
      return expect(fractal.render('foo')).to.be.rejectedWith(Error, '[target-invalid]');
    });
    it('returns an EmittingPromise', function () {
      const fractal = makeFractal();
      expect(fractal.render(view)).to.be.instanceOf(EmittingPromise);
    });
    it('Can render components', async function () {
      const fractal = makeFractal();
      const component = parserOutput.components.first();
      const opts = {collections: parserOutput};
      expect(await fractal.render(component, {}, opts)).to.equal('component!');
    });
    it('Can render variants', async function () {
      const fractal = makeFractal();
      const spy = sinon.spy(fractal.renderer, 'render');
      const variant = parserOutput.components.first().variants.first();
      const view = parserOutput.components.first().files.find({stem: 'view'});
      const opts = {collections: parserOutput};
      const result = await fractal.render(variant, {}, opts);
      expect(result).to.equal('component!');
      expect(spy.calledWith(view, variant.context)).to.equal(true);
      spy.restore();
    });
    it('rejects if a specified variant cannot be found', function () {
      const fractal = makeFractal();
      return expect(fractal.render(parserOutput.components.first(), {}, {
        collections: parserOutput,
        variant: 'foo'
      })).to.be.rejectedWith(Error, '[variant-not-found]');
    });
    it('rejects if a variants\' component cannot be found', function () {
      const fractal = makeFractal();
      const variant = new Variant({
        name: 'default',
        default: true,
        component: 'foo-component'
      });
      return expect(fractal.render(variant, {}, {
        collections: parserOutput
      })).to.be.rejectedWith(Error, '[component-not-found]');
    });
    it('rejects if a suitable view cannot be found', function () {
      const fractal = makeFractal();
      fractal.renderer.addAdapter({
        name: 'fwig',
        match: '.fwig',
        render: () => {}
      });
      return expect(fractal.render(parserOutput.components.first(), {}, {
        adapter: 'fwig',
        collections: parserOutput
      })).to.be.rejectedWith(Error, '[view-not-found]');
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

  describe('.watch()', function () {
    let fractal;
    let watcher;
    beforeEach(function () {
      fractal = new Fractal({
        src: [tmp + '/**/*']
      });
      watcher = fractal.watch();
    });
    afterEach(function () {
      watcher.close();
    });
    it('returns a chokidar instance', function () {
      expect(watcher).to.be.instanceOf(FSWatcher);
    });
    it('returns the same instance if called twice', function () {
      const sameWatcher = fractal.watch();
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
        expect(fractal.dirty).to.equal(true);
        done();
      });
      fractal.dirty = false;
      writeFile('foo.js');
    });
  });

  describe('.unwatch()', function () {
    let fractal;
    let watcher;
    beforeEach(function () {
      fractal = new Fractal({
        src: [tmp + '/**/*']
      });
      watcher = fractal.watch();
    });
    afterEach(function () {
      watcher.close();
    });
    it('closes the chokidar instance', function () {
      fractal.unwatch();
      expect(watcher.closed).to.equal(true);
    });
    it('removes the instance so the next call to watch() initializes a fresh one', function () {
      fractal.unwatch();
      const newWatcher = fractal.watch();
      expect(watcher).to.not.equal(newWatcher);
    });
  });

  describe('.toString()', function () {
    it('property describes the Fractal instance', function () {
      const fractal = new Fractal();
      expect(fractal.toString()).to.equal('[object Fractal]');
    });
  });

  describe('.dirty', function () {
    it('gets and sets the dirty property', function () {
      const fractal = new Fractal();
      fractal.dirty = false;
      expect(fractal.dirty).to.equal(false);
      fractal.dirty = true;
      expect(fractal.dirty).to.equal(true);
    });
    it('clears the cache when set to true', function () {
      const fractal = new Fractal();
      const spy = sinon.spy(fractal.cache, 'del');
      fractal.dirty = true;
      expect(spy.called).to.equal(true);
      spy.reset();
      fractal.dirty = false;
      expect(spy.called).to.equal(false);
      spy.restore();
    });
  });

  describe('.cache', function () {
    it('returns the parser cache instance', function () {
      const fractal = new Fractal();
      expect(fractal.cache).to.be.instanceof(Cache);
    });
  });

  describe('.renderer', function () {
    it('returns the renderer instance', function () {
      const fractal = new Fractal();
      expect(fractal.renderer).to.be.instanceof(Renderer);
    });
  });

  describe('.parser', function () {
    it('returns the parser instance', function () {
      const fractal = new Fractal();
      expect(fractal.parser).to.be.instanceof(Parser);
    });
  });

  describe('.config', function () {
    it('returns the config data', function () {
      const fractal = new Fractal({
        foo: 'bar'
      });
      expect(fractal.config).to.be.an('object').with.property('foo').that.equals('bar');
    });
    it('is cloned so that the config is not mutable', function () {
      const fractal = new Fractal({
        foo: 'bar'
      });
      fractal.config.foo = 'oops';
      expect(fractal.get('foo')).to.equal('bar');
    });
  });

  describe('.version', function () {
    it('returns the version number from the package.json file', function () {
      const fractal = new Fractal();
      expect(fractal.version).to.equal(pkg.version);
    });
  });

  describe('.isFractal', function () {
    it('is true', function () {
      const fractal = new Fractal();
      expect(fractal.isFractal).to.equal(true);
    });
  });
});
