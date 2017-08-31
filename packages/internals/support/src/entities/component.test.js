/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../../test/helpers');
const FileCollection = require('../collections/file-collection');
const File = require('./file');

const Component = require('./component');

const basicComponent = {
  src: new File({path: '/src/component', cwd: '/'})
};

const fullComponent = {
  src: new File({path: '/src/component', cwd: '/'}),
  files: new FileCollection([new File({path: '/src/component/component.js'}), new File({path: '/src/component/component.hbs'})]),
  config: {
    name: 'component-name-set',
    variants: [{name: 'component--v1'}, {name: 'component--v2'}],
    refresh: true
  }
};

describe('Component', function () {
  describe('constructor', function () {
    it('returns a new instance if correct properties provided', function () {
      const componentB = new Component(basicComponent);
      expect(componentB).to.exist;
      expect(componentB instanceof Component).to.be.true;

      const componentF = new Component(fullComponent);
      expect(componentF).to.exist;
      expect(componentF instanceof Component).to.be.true;
    });
    it(`derives 'name' from path correctly if not set directly`, function () {
      const component = new Component(basicComponent);
      expect(component.name).to.equal('component');
      expect(component.get('name')).to.equal('component');
    });
    it(`assigns 'name' correctly if set directly`, function () {
      const component = new Component(fullComponent);
      expect(component.name).to.equal('component-name-set');
      expect(component.get('name')).to.equal('component-name-set');
    });
    it(`creates default 'variants', and 'files' properties if not set`, function () {
      const component = new Component(basicComponent);
      expect(component.getVariants()).to.be.a('VariantCollection').that.has.a.property('length').that.equals(1);
      expect(component.getFiles()).to.be.a('FileCollection').that.has.a.property('length').that.equals(0);
    });
    it(`assigns 'variants', and 'files' properties correctly if provided`, function () {
      const component = new Component(fullComponent);
      expect(component.getVariants()).to.be.a('VariantCollection').that.has.a.property('length').that.equals(2);
      expect(component.getFiles()).to.be.a('FileCollection').that.has.a.property('length').that.equals(2);
    });
    it('throws an error if incorrect properties provided', function () {
      expect(() => new Component()).to.throw(TypeError, '[properties-invalid]');
    });
  });
  describe('.getFiles()', function () {
    it('gets files correctly', function () {
      const component = new Component(basicComponent);
      expect(component.getFiles().length).to.equal(0);
      for (let file of fullComponent.files.items) {
        component.addFile(file);
      }
      expect(component.getFiles().length).to.equal(2);
      expect(() => {
        component.addFile([]);
      }).to.throw(TypeError, `[properties-invalid]`);
    });
  });
  describe('.getVariants()', function () {
    it('gets variants correctly', function () {
      const component = new Component(basicComponent);
      expect(component.getVariants().length).to.equal(1);
      for (let variant of fullComponent.config.variants) {
        component.addVariant(variant);
      }
      expect(component.getVariants().length).to.equal(3);
      expect(() => {
        component.addVariant(['dd']);
      }).to.throw(TypeError, `[properties-invalid]`);
    });
  });
  describe('.getVariant()', function () {
    it('gets named variant correctly when only default exists', function () {
      const component = new Component(basicComponent);
      expect(component.getVariant('default'))
      .to.be.a('Variant')
      .with.property('name')
      .that.equals('default');
    });
    it('gets named variant correctly', function () {
      const component = new Component(fullComponent);
      expect(component.getVariant('component--v1'))
      .to.be.a('Variant')
      .with.property('name')
      .that.equals('component--v1');
    });
    it('returns undefined for nonexistant variant', function () {
      const component = new Component(fullComponent);
      expect(component.getVariant('component--v0')).to.be.undefined;
    });
  });
  describe('.isComponent()', function () {
    it('returns true if an instance is a Component', function () {
      expect(Component.isComponent(new Component(basicComponent))).to.equal(true);
    });
    it('returns false if an instance is not a Component', function () {
      expect(Component.isComponent([])).to.equal(false);
    });
  });
  describe('.get()', function () {
    it('falls back to config data if a value does not exist on the store', function () {
      const component = new Component(fullComponent);
      expect(component.get('refresh')).to.equal(true);
    });
    it(`falls back to the 'fallback' argument if neither 'data' nor 'config' return a value`, function () {
      const component = new Component(fullComponent);
      expect(component.get('fabulous', 'hair')).to.equal('hair');
    });
  });
  describe('.clone()', function () {
    it('creates a new instance', function () {
      const component = new Component(basicComponent);
      const newComponent = component.clone();
      expect(Component.isComponent(newComponent)).to.equal(true);
      expect(newComponent).to.not.equal(component);
    });
  });
  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const component = new Component(basicComponent);
      expect(component[Symbol.toStringTag]).to.equal('Component');
    });
  });
});
