/* eslint no-unused-expressions: "off" */

const {expect, sinon} = require('../../../../../test/helpers');
const FileCollection = require('../collections/file-collection');
const TemplateCollection = require('../collections/template-collection');
const VariantCollection = require('../collections/variant-collection');
const ScenarioCollection = require('../collections/scenario-collection');
const Component = require('./component');
const Template = require('./template');
const Variant = require('./variant');
const Scenario = require('./scenario');
const Entity = require('./entity');
const File = require('./file');

const basicComponent = {
  id: 'test-component',
  src: new File({
    path: '/components/@foo',
    base: '/components'
  }),
  config: {
    foo: 'bar'
  }
};

const templateFile = new File({
  path: '/src/component/view.hbs',
  contents: Buffer.from('<div></div>')
});

const template = Template.fromFile(templateFile);

const fullComponent = {
  id: 'full-component',
  src: new File({path: '/src/component', cwd: '/'}),
  files: [new File({path: '/src/component/component.js'}), templateFile],
  views: [templateFile],
  variants: [{id: 'variant-1'}, {id: 'variant-2'}],
  scenarios: [{id: 'scenario-1'}, {id: 'scenario-2'}, {id: 'scenario-3'}],
  config: {
    id: 'component-id-set',
    variants: [{id: 'component-v1'}, {id: 'component-v2'}],
    refresh: true
  }
};

const makeComponent = input => new Component(input || basicComponent);

describe('Component', function () {
  describe('constructor', function () {
    it('returns a new instance that extends the Entity class', function () {
      const component = makeComponent();
      expect(component).to.exist;
      expect(component).to.be.instanceOf(Entity);
    });
    it('returns a new instance if correct properties provided', function () {
      const componentB = new Component(basicComponent);
      expect(componentB).to.exist;
      expect(componentB instanceof Component).to.be.true;
      const componentF = new Component(fullComponent);
      expect(componentF).to.exist;
      expect(componentF instanceof Component).to.be.true;
    });
    it('throws an error if incorrect properties provided', function () {
      expect(() => new Component()).to.throw(TypeError, '[properties-invalid]');
    });
    it('creates a default variant if none are supplied', function () {
      const component = makeComponent();
      expect(component.variants.length).to.equal(1);
      expect(component.variants.first().id).to.equal('default');
    });
    it('does not create a default variant if one or more are supplied', function () {
      const component = makeComponent(fullComponent);
      expect(component.variants.first().id).to.not.equal('default');
    });
  });

  describe('.src', function () {
    it('returns the source directory', function () {
      const component = makeComponent();
      expect(File.isFile(component.src)).to.be.true;
      expect(component.src).to.eql(basicComponent.src);
    });
    it('throws an error if set after instantiation', function () {
      const component = makeComponent();
      expect(() => {
        component.src = new File({path: '/src/component', cwd: '/'});
      }).to.throw('[invalid-set-src]');
    });
  });

  describe('.path', function () {
    it('returns the source directory path', function () {
      const component = makeComponent();
      expect(component.path).to.eql(basicComponent.src.path);
    });
    it('throws an error if set after instantiation', function () {
      const component = makeComponent();
      expect(() => {
        component.path = '/src/component';
      }).to.throw('[invalid-set-path]');
    });
  });

  describe('.relative', function () {
    it('returns the relative path of the source directory', function () {
      const component = makeComponent();
      expect(component.relative).to.eql(basicComponent.src.relative);
    });
    it('throws an error if set after instantiation', function () {
      const component = makeComponent();
      expect(() => {
        component.relative = '/';
      }).to.throw('[invalid-set-relative]');
    });
  });

  describe('.files', function () {
    it('returns the collection of component files', function () {
      const component = makeComponent(fullComponent);
      expect(component.files).to.be.instanceOf(FileCollection);
      expect(component.files.length).to.equal(fullComponent.files.length);
    });
    it('throws an error if set after instantiation', function () {
      const component = makeComponent();
      expect(() => {
        component.files = new FileCollection();
      }).to.throw('[invalid-set-files]');
    });
  });

  describe('.views', function () {
    it('returns the collection of component files', function () {
      const component = makeComponent(fullComponent);
      expect(component.views).to.be.instanceOf(TemplateCollection);
      expect(component.views.length).to.equal(fullComponent.views.length);
    });
    it('throws an error if set after instantiation', function () {
      const component = makeComponent();
      expect(() => {
        component.views = new TemplateCollection();
      }).to.throw('[invalid-set-views]');
    });
  });

  describe('.variants', function () {
    it('returns the collection of component variants', function () {
      const component = makeComponent(fullComponent);
      expect(component.variants).to.be.instanceOf(VariantCollection);
      expect(component.variants.length).to.equal(fullComponent.variants.length);
    });
    it('throws an error if set after instantiation', function () {
      const component = makeComponent();
      expect(() => {
        component.variants = new VariantCollection();
      }).to.throw('[invalid-set-variants]');
    });
  });

  describe('.scenarios', function () {
    it('returns the collection of component scenarios', function () {
      const component = makeComponent(fullComponent);
      expect(component.scenarios).to.be.instanceOf(ScenarioCollection);
      expect(component.scenarios.length).to.equal(fullComponent.scenarios.length);
    });
    it('throws an error if set after instantiation', function () {
      const component = makeComponent();
      expect(() => {
        component.scenarios = new ScenarioCollection();
      }).to.throw('[invalid-set-scenarios]');
    });
  });

  describe('.config', function () {
    it('returns a cloned configuration object', function () {
      const component = makeComponent();
      expect(component.config).to.eql(basicComponent.config);
      expect(component.config).to.not.equal(basicComponent.config);
    });
    it('throws an error if set after instantiation', function () {
      const component = makeComponent();
      expect(() => {
        component.config = {};
      }).to.throw('[invalid-set-config]');
    });
  });

  describe('.getFiles()', function () {
    it('is an alias for .files', function () {
      const component = new Component(fullComponent);
      expect(component.getFiles()).to.equal(component.files);
    });
  });

  describe('.addFile()', function () {
    it('adds a file to the file collection', function () {
      const component = new Component(basicComponent);
      expect(component.getFiles().length).to.equal(0);
      component.addFile(fullComponent.files[0]);
      expect(component.getFiles().length).to.equal(1);
    });
    it('clones the file that is supplied', function () {
      const component = new Component(basicComponent);
      const file = fullComponent.files[0];
      component.addFile(file);
      expect(component.getFiles().first()).to.not.equal(file);
      expect(component.getFiles().first().path).to.equal(file.path);
    });
    it('sets the base path of the file to the component directory path', function () {
      const component = new Component(basicComponent);
      component.addFile(fullComponent.files[0]);
      expect(component.getFiles().first().base).to.equal(component.path);
    });
    it('throws an error if an invalid file object is supplied', function () {
      const component = new Component(basicComponent);
      expect(() => {
        component.addFile([]);
      }).to.throw(TypeError, `[properties-invalid]`);
    });
  });

  describe('.getViews()', function () {
    it('is an alias for .views', function () {
      const component = new Component(fullComponent);
      expect(component.getViews()).to.equal(component.views);
    });
  });

  describe('.getView()', function () {
    it('returns the first view when called with no args', function () {
      const component = new Component(fullComponent);
      expect(component.getView()).to.equal(component.views[0]);
    });
    it('proxies the view collection .find() method when args are supplied', function () {
      const component = new Component(fullComponent);
      const spy = sinon.spy(component.views, 'find');
      const args = {basename: 'view.hbs'};
      expect(component.getView(args)).to.equal(component.views[0]);
      expect(spy.calledWith(args)).to.be.true;
      spy.restore();
    });
  });

  describe('.addView()', function () {
    it('adds a template to the view collection', function () {
      const component = new Component(basicComponent);
      expect(component.views.length).to.equal(0);
      component.addView(template);
      expect(component.views.length).to.equal(1);
    });
    it('converts files to templates', function () {
      const component = new Component(basicComponent);
      expect(component.views.length).to.equal(0);
      component.addView(templateFile);
      expect(component.views.length).to.equal(1);
      expect(component.views[0]).to.be.instanceOf(Template);
    });
    it('clones the file that is supplied', function () {
      const component = new Component(basicComponent);
      const view = fullComponent.views[0];
      component.addView(view);
      expect(component.getViews().first()).to.not.equal(view);
      expect(component.getViews().first().path).to.equal(view.path);
    });
    it('adds the view to the file collection if not present', function () {
      const component = new Component(basicComponent);
      expect(component.views.length).to.equal(0);
      const view = fullComponent.views[0];
      component.addView(view);
      expect(component.getFiles().first()).to.be.instanceOf(File);
      expect(component.getFiles().first().path).to.equal(view.path);
    });
    it('sets the base path of the template to the component directory path', function () {
      const component = new Component(basicComponent);
      component.addView(fullComponent.views[0]);
      expect(component.getViews().first().base).to.equal(component.path);
    });
    it('throws an error if an invalid file object is supplied', function () {
      const component = new Component(basicComponent);
      expect(() => {
        component.addView([]);
      }).to.throw(TypeError, `[properties-invalid]`);
    });
  });

  describe('.getVariants()', function () {
    it('is an alias for .variants', function () {
      const component = new Component(fullComponent);
      expect(component.getVariants()).to.equal(component.variants);
    });
  });

  describe('.getVariant()', function () {
    it('returns the default variant when called with no args', function () {
      const component = new Component(fullComponent);
      expect(component.getVariant()).to.equal(component.getDefaultVariant());
    });
    it('proxies the variant collection .find() method when args are supplied', function () {
      const component = new Component(fullComponent);
      const spy = sinon.spy(component.variants, 'find');
      const args = 'variant-1';
      expect(component.getVariant(args)).to.equal(component.variants.find('variant-1'));
      expect(spy.calledWith(args)).to.be.true;
      spy.restore();
    });
  });

  describe('.getDefaultVariant()', function () {
    it('returns the first variant', function () {
      const component = new Component(fullComponent);
      expect(component.getDefaultVariant()).to.equal(component.variants[0]);
    });
  });

  describe('.isDefaultVariant()', function () {
    it('checks if the variant is the default variant', function () {
      const component = new Component(fullComponent);
      expect(component.isDefaultVariant(component.variants[0])).to.be.true;
      expect(component.isDefaultVariant(component.variants[1])).to.be.false;
    });
  });

  describe('.addVariant()', function () {
    it('adds a variant to the component variants collection', function () {
      const component = new Component(basicComponent);
      const variantsCount = component.variants.length;
      component.addVariant({id: 'new-variant'});
      expect(component.variants.length).to.equal(variantsCount + 1);
    });
    it('converts plain objects to variant instances', function () {
      const component = new Component(basicComponent);
      component.addVariant({id: 'new-variant'});
      expect(component.getVariant('new-variant')).to.be.instanceOf(Variant);
    });
    it('adds copies of all views to the variant if a plain object is provided', function () {
      const component = new Component(basicComponent);
      component.addVariant({id: 'new-variant'});
      expect(component.getVariant('new-variant').views).to.eql(component.views);
      expect(component.getVariant('new-variant').views).to.not.equal(component.views);
    });
    it('does not add views if a variant instance is provided', function () {
      const component = new Component(basicComponent);
      component.addVariant(new Variant({id: 'new-variant'}));
      expect(component.getVariant('new-variant').views.length).to.equal(0);
    });
  });

  describe('.getScenarios()', function () {
    it('is an alias for .scenarios', function () {
      const component = new Component(fullComponent);
      expect(component.getScenarios()).to.equal(component.scenarios);
    });
  });

  describe('.getScenario()', function () {
    it('returns the default scenario when called with no args', function () {
      const component = new Component(fullComponent);
      expect(component.getScenario()).to.equal(component.getDefaultScenario());
    });
    it('proxies the scenario collection .find() method when args are supplied', function () {
      const component = new Component(fullComponent);
      const spy = sinon.spy(component.scenarios, 'find');
      const args = 'scenario-1';
      expect(component.getScenario(args)).to.equal(component.scenarios.find('scenario-1'));
      expect(spy.calledWith(args)).to.be.true;
      spy.restore();
    });
  });

  describe('.getDefaultScenario()', function () {
    it('returns the first scenario', function () {
      const component = new Component(fullComponent);
      expect(component.getDefaultScenario()).to.equal(component.scenarios[0]);
    });
  });

  describe('.addScenario()', function () {
    it('adds a scenario to the component scenarios collection', function () {
      const component = new Component(basicComponent);
      const scenariosCount = component.scenarios.length;
      component.addScenario({id: 'new-scenario'});
      expect(component.scenarios.length).to.equal(scenariosCount + 1);
    });
    it('converts plain objects to scenario instances', function () {
      const component = new Component(basicComponent);
      component.addScenario({id: 'new-scenario'});
      expect(component.getScenario('new-scenario')).to.be.instanceOf(Scenario);
    });
  });

  describe('.isComponent()', function () {
    it('returns true if an instance is a Component', function () {
      expect(Component.isComponent(makeComponent())).to.equal(true);
    });
    it('returns false if an instance is not a Component', function () {
      expect(Component.isComponent([])).to.equal(false);
    });
  });

  describe('.clone()', function () {
    it('creates a new instance', function () {
      const component = makeComponent();
      const newComponent = component.clone();
      expect(Component.isComponent(newComponent)).to.equal(true);
      expect(newComponent).to.not.equal(component);
      expect(newComponent).to.eql(component);
    });
    it(`preserves the UUID of the component`, function () {
      const component = makeComponent();
      const newComponent = component.clone();
      expect(component.getIdentifier()).to.equal(newComponent.getIdentifier());
    });
  });

  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const component = makeComponent();
      expect(component[Symbol.toStringTag]).to.equal('Component');
    });
  });
});
