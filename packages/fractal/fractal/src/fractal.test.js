/* eslint import/no-dynamic-require: off,  no-unused-expressions: off */

const {join} = require('path');
const {capitalize} = require('lodash');
const {File, ComponentCollection, FileCollection, EmittingPromise, Component, Variant} = require('@frctl/support');
const {defaultsDeep} = require('@frctl/utils');
const App = require('@frctl/app');
const Renderer = require('@frctl/renderer');
const {expect, sinon} = require('../../../../test/helpers');
const pkg = require('../package.json');
const ConfigStore = require('./config/store');
const defaults = require('./config/defaults');
const Fractal = require('./fractal');

const config = {
  src: join(__dirname, '../../../../test/fixtures/components'),
  presets: null,
  engines: [
    './test/fixtures/add-ons/engine'
  ]
};

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
        id: 'default',
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
      expect(() => new Fractal({engines: 'foo'})).to.throw('[config-invalid]');
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
      expect(fractal.render(components.first())).to.be.instanceOf(EmittingPromise);
    });
    it('resolves to a string', async function () {
      const fractal = makeFractal();
      expect(await fractal.render(components.first())).to.be.a('string');
    });
    it('rejects if no engines have been added', function () {
      const fractal = makeFractal({
        extends: null
      });
      const result = fractal.render(components.first());
      expect(result).to.be.instanceOf(EmittingPromise);
      return expect(result).to.be.rejectedWith(Error, '[engine-not-found]');
    });
    it('rejects if the target is not a component or variant', function () {
      const fractal = makeFractal();
      return expect(fractal.render({})).to.be.rejectedWith(Error, '[target-invalid]');
    });
    it('Can render components', async function () {
      const fractal = makeFractal();
      sinon.stub(fractal, 'parse').callsFake(() => Promise.resolve(parserOutput));
      const component = parserOutput.components.first();
      expect(await fractal.render(component, {})).to.equal('component!');
    });
    it('Can render variants', async function () {
      const fractal = makeFractal();
      sinon.stub(fractal, 'parse').callsFake(() => Promise.resolve(parserOutput));
      const variant = parserOutput.components.first().getDefaultVariant();
      const result = await fractal.render(variant);
      expect(result).to.equal('component!');
    });
    it('rejects if a specified variant cannot be found', function () {
      const fractal = makeFractal();
      return expect(fractal.render(parserOutput.components.first(), {}, {
        variant: 'foo'
      })).to.be.rejectedWith(Error, '[variant-not-found]');
    });
    it('rejects if a variants\' component cannot be found', function () {
      const fractal = makeFractal();
      sinon.stub(fractal, 'parse').callsFake(() => Promise.resolve(parserOutput));
      const variant = new Variant({
        id: 'default',
        default: true
        component: 'foo-component'
      });
      return expect(fractal.render(variant, {})).to.be.rejectedWith(Error, '[component-not-found]');
    });
    it('rejects if a suitable template cannot be found', function () {
      const fractal = makeFractal();
      sinon.stub(fractal, 'parse').callsFake(() => Promise.resolve(parserOutput));
      fractal.addEngine({
        name: 'fwig',
        match: '.fwig',
        render: () => {}
      });
      return expect(fractal.render(parserOutput.components.first(), {}, {
        ext: '.fwig'
      })).to.be.rejectedWith(Error, '[template-not-found]');
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

  for (const addOn of ['plugin', 'transform', 'engine']) {
    const method = `add${capitalize(addOn)}`;
    describe(`.${method}()`, function () {
      it(`adds a ${addOn} to the ${addOn}s config array`, function () {
        const app = new Fractal({presets: null});
        expect(app.get(`${addOn}s`)).to.be.an('array');
        const count = app.get(`${addOn}s`).length;
        app[method](`./test/fixtures/add-ons/${addOn}`);
        expect(app.get(`${addOn}s`).length).equal(count + 1);
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
    it('returns a configured Renderer instance', function () {
      const fractal = new Fractal();
      expect(fractal.getRenderer()).to.be.instanceof(Renderer);
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
