/* eslint import/no-dynamic-require: off,  no-unused-expressions: off */

const {join} = require('path');
const {capitalize} = require('lodash');
const {File, ComponentCollection, FileCollection, EmittingPromise, Component, Variant} = require('@frctl/support');
const {defaultsDeep} = require('@frctl/utils');
const {Renderer} = require('@frctl/renderer');
const App = require('@frctl/app');
const {expect, sinon} = require('../../../../test/helpers');
const pkg = require('../package.json');
const ConfigStore = require('./config/store');
const defaults = require('./config/defaults');
const Fractal = require('./fractal');

const config = {
  src: join(__dirname, '../../../../test/fixtures/components'),
  presets: null,
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
    src: files.find({
      stem: '@test-component'
    }),
    files: FileCollection.from([
      new File({
        name: 'view',
        base: 'components/@test-component',
        path: 'components/@test-component/view.fjk',
        contents: Buffer.from('component!')
      })
    ]),
    config: {
      name: 'test-component',
      views: {
        match: 'view.*'
      },
      variants: [{
        name: 'default',
        default: true,
        component: 'test-component',
        context: {
          foo: 'bar'
        }
      }]
    }
  })
]);

const parserOutput = {components, files};

function makeFractal(customConfig) {
  return new Fractal(customConfig || config);
}

describe('Fractal', function () {
  describe('constructor()', function () {
    it('wraps configuration data in a ConfigStore instance', () => {
      const fractal = makeFractal();
      expect(fractal.config.data).to.eql(defaultsDeep(config, defaults));
      expect(fractal.config).to.be.instanceOf(ConfigStore);
    });
    it('throws an error if invalid config data is provided', () => {
      expect(() => new Fractal({adapters: 'foo'})).to.throw('[config-invalid]');
    });
    it('does not throw an error if no config data is provided', () => {
      expect(() => new Fractal()).to.not.throw();
    });
    it('extends App', () => {
      expect(new Fractal()).to.be.instanceOf(App);
    });
  });

  describe('.render()', function () {
    it('returns an EmittingPromise', function () {
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
    it('rejects if the specified adapter cannot be found', function () {
      const fractal = makeFractal();
      return expect(fractal.render(view, {}, {
        adapter: 'foo'
      })).to.eventually.be.rejectedWith(Error, '[adapter-not-found]');
    });
    it('rejects if the target is not a view, component, variant or string', function () {
      const fractal = makeFractal();
      return expect(fractal.render({})).to.be.rejectedWith(Error, '[target-invalid]');
    });
    it('returns an EmittingPromise', function () {
      const fractal = makeFractal();
      expect(fractal.render(view)).to.be.instanceOf(EmittingPromise);
    });
    it('Can render components', async function () {
      const fractal = makeFractal();
      sinon.stub(fractal, 'parse').callsFake(() => Promise.resolve(parserOutput));
      const component = parserOutput.components.first();
      expect(await fractal.render(component, {})).to.equal('component!');
    });
    it('Can render variants', async function () {
      const fractal = makeFractal();
      const renderer = new Renderer(fractal.get('adapters'));
      sinon.stub(fractal, 'parse').callsFake(() => Promise.resolve(parserOutput));
      sinon.stub(fractal, 'getRenderer').callsFake(() => renderer);
      const spy = sinon.spy(renderer, 'render');
      const variant = parserOutput.components.first().getDefaultVariant();
      const result = await fractal.render(variant);
      expect(result).to.equal('component!');
      expect(spy.args[0][0]).to.equal('component!');
      expect(spy.args[0][1]).to.eql(variant.context);
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
      sinon.stub(fractal, 'parse').callsFake(() => Promise.resolve(parserOutput));
      const variant = new Variant({
        name: 'default',
        default: true,
        component: 'foo-component'
      });
      return expect(fractal.render(variant, {})).to.be.rejectedWith(Error, '[component-not-found]');
    });
    it('rejects if a suitable view cannot be found', function () {
      const fractal = makeFractal();
      sinon.stub(fractal, 'parse').callsFake(() => Promise.resolve(parserOutput));
      fractal.addAdapter({
        name: 'fwig',
        match: '.fwig',
        render: () => {}
      });
      return expect(fractal.render(parserOutput.components.first(), {}, {
        adapter: 'fwig'
      })).to.be.rejectedWith(Error, '[view-not-found]');
    });
  });

  describe('.getComponents()', function () {
    it('returns an EmittingPromise', function () {
      const fractal = new Fractal();
      expect(fractal.getComponents()).to.be.instanceOf(EmittingPromise);
    });
    it('resolves to a ComponentCollection instance', async function () {
      const fractal = new Fractal();
      const components = await fractal.getComponents();
      expect(components).to.be.instanceOf(ComponentCollection);
    });
  });

  for (const addOn of ['plugin', 'transform', 'adapter']) {
    const method = `add${capitalize(addOn)}`;
    describe(`.${method}()`, function () {
      it(`adds a ${addOn} to the ${addOn}s config array`, function () {
        const app = new Fractal({presets: null});
        expect(app.get(`${addOn}s`)).to.be.an('array').and.have.property('length').which.equals(0);
        app[method](`./test/fixtures/add-ons/${addOn}`);
        expect(app.get(`${addOn}s`).length).equal(1);
      });
      it(`marks the app instance as dirty`, function () {
        const app = new Fractal({presets: null});
        app.dirty = false;
        app[method](`./test/fixtures/add-ons/${addOn}`);
        expect(app.dirty).to.equal(true);
      });
      it(`accepts ${addOn} paths`, function () {
        const app = new Fractal({presets: null});
        app[method](`./test/fixtures/add-ons/${addOn}`);
        expect(app.get(`${addOn}s`)[0]).to.be.an(`object`);
      });
      it(`accepts ${addOn} packages`, function () {
        const app = new Fractal({presets: null});
        app[method](require(`../../../../test/fixtures/add-ons/${addOn}`));
        expect(app.get(`${addOn}s`)[0]).to.be.an(`object`);
      });
      it(`accepts ${addOn} objects`, function () {
        const app = new Fractal({presets: null});
        app[method](require(`../../../../test/fixtures/add-ons/${addOn}`)());
        expect(app.get(`${addOn}s`)[0]).to.be.an(`object`);
      });
      it(`accepts ${addOn} config via the add-on array syntax`, function () {
        const app = new Fractal({presets: null});
        const spy = sinon.spy(() => ({
          name: `test-${addOn}`
        }));
        const opts = {dothis: true};
        app[method]([spy, opts]);
        expect(app.get(`${addOn}s`)[0]).to.be.an(`object`);
        expect(spy.calledWith(opts)).to.equal(true);
      });
      it(`returns the App instance`, function () {
        const app = new Fractal({presets: null});
        expect(app[method](`./test/fixtures/add-ons/${addOn}`)).to.equal(app);
      });
    });
  }

  describe('.getRenderer()', function () {
    it('returns a new Renderer instance', function () {
      const fractal = new Fractal();
      const renderer = fractal.getRenderer();
      expect(renderer).to.be.instanceOf(Renderer);
      expect(fractal.getRenderer()).to.not.equal(renderer);
    });
    it('initialises the renderer with adapters from the config', function () {
      const fractal = new Fractal();
      const renderer = fractal.getRenderer();
      expect(renderer.adapters.length).to.equal(0);
      fractal.addAdapter('./test/fixtures/add-ons/adapter');
      const renderer2 = fractal.getRenderer();
      expect(renderer2.adapters.length).to.equal(1);
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
