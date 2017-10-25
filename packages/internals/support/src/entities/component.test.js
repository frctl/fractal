/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../../test/helpers');
// const reservedWords = require('../../reserved-words');
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
    id: 'component-id-set',
    variants: [{id: 'component-v1'}, {id: 'component-v2'}],
    refresh: true
  }
};

describe('Component', function () {
  describe('constructor', function () {
    it('returns a new instance if correct properties provided', function () {
      const componentB = Component.from(basicComponent);
      expect(componentB).to.exist;
      expect(componentB instanceof Component).to.be.true;

      const componentF = Component.from(fullComponent);
      expect(componentF).to.exist;
      expect(componentF instanceof Component).to.be.true;
    });
    it(`derives 'id' from path correctly if not set directly`, function () {
      const component = Component.from(basicComponent);
      expect(component.id).to.equal('component');
      expect(component.get('id')).to.equal('component');
    });
    it(`assigns 'id' correctly if set directly`, function () {
      const component = Component.from(fullComponent);
      expect(component.id).to.equal('component-id-set');
      expect(component.get('id')).to.equal('component-id-set');
    });
    it(`creates default 'variants', and 'files' properties if not set`, function () {
      const component = Component.from(basicComponent);
      expect(component.getVariants()).to.be.a('VariantCollection').that.has.a.property('length').that.equals(1);
      expect(component.getFiles()).to.be.a('FileCollection').that.has.a.property('length').that.equals(0);
    });
    it(`assigns 'variants', and 'files' properties correctly if provided`, function () {
      const component = Component.from(fullComponent);
      expect(component.getVariants()).to.be.a('VariantCollection').that.has.a.property('length').that.equals(2);
      expect(component.getFiles()).to.be.a('FileCollection').that.has.a.property('length').that.equals(2);
    });
    it('throws an error if incorrect properties provided', function () {
      expect(() => Component.from()).to.throw(TypeError, '[properties-invalid]');
    });
  });

  describe('.getFiles()', function () {
    it('gets files correctly', function () {
      const component = Component.from(basicComponent);
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

  describe('.addFile()', function () {
    it('sets the base path of the file to the root path of the component', function () {
      const component = Component.from(basicComponent);
      component.addFile(new File({path: '/src/component/foo.js'}));
      expect(component.getFiles().find('stem', 'foo').base).to.equal('/src/component');
    });
    it('clones the file before adding', function () {
      const component = Component.from(basicComponent);
      const file = new File({path: '/src/component/foo.js'});
      component.addFile(file);
      const addedFile = component.getFiles().find('stem', 'foo');
      expect(addedFile).to.eql(file);
      expect(addedFile).to.not.equal(file);
    });
  });

  describe('.addVariant()', function () {
    it('adds variants correctly', function () {
      const component = Component.from(basicComponent);
      expect(component.getVariants().length).to.equal(1);
      for (let variant of fullComponent.config.variants) {
        component.addVariant(variant);
      }
      expect(component.getVariants().length).to.equal(3);
    });
    it('throws an error if invalid variant properties added', function () {
      const component = Component.from(basicComponent);
      expect(() => {
        component.addVariant(['dd']);
      }).to.throw(TypeError, `[props-invalid]`);
    });
    it('adds the component ID to all variants added');
    it('generates templates for each variant from the component views');
  });

  describe('.getVariants()', function () {
    it('gets variants correctly', function () {
      const component = Component.from(basicComponent);
      expect(component.getVariants().length).to.equal(1);
      for (let variant of fullComponent.config.variants) {
        component.addVariant(variant);
      }
      expect(component.getVariants().length).to.equal(3);
    });
  });

  describe('.getVariant()', function () {
    it('gets named variant correctly when only default exists', function () {
      const component = Component.from(basicComponent);
      expect(component.getVariant('default'))
      .to.be.a('Variant')
      .with.property('id')
      .that.equals('default');
    });
    it('gets named variant correctly', function () {
      const component = Component.from(fullComponent);
      expect(component.getVariant('component-v1'))
      .to.be.a('Variant')
      .with.property('id')
      .that.equals('component-v1');
    });
    it('returns undefined for nonexistant variant', function () {
      const component = Component.from(fullComponent);
      expect(component.getVariant('does-not-exist')).to.be.undefined;
    });
  });

  describe('.getDefaultVariant()', function () {
    it('returns the first variant if no default config prop is set ', function () {
      const component = Component.from(basicComponent);
      expect(component.getDefaultVariant()).to.equal(component.getVariants().first());
    });
    it('allows specifying a default variant via the `default` config property', function () {
      const comp = Object.assign({}, fullComponent);
      comp.config = Object.assign({}, comp.config, {default: 'component-v2'});
      const component = Component.from(comp);
      expect(component.getDefaultVariant()).to.equal(component.getVariants().find('component-v2'));
    });
  });

  describe('.getVariantOrDefault()', function () {
    it('gets named variant correctly when only default exists', function () {
      const component = Component.from(basicComponent);
      expect(component.getVariantOrDefault('default'))
      .to.be.a('Variant')
      .with.property('id')
      .that.equals('default');
    });
    it('gets named variant correctly', function () {
      const component = Component.from(fullComponent);
      expect(component.getVariantOrDefault('component-v1'))
      .to.be.a('Variant')
      .with.property('id')
      .that.equals('component-v1');
    });
    it('returns default variant for nonexistant variant id', function () {
      const component = Component.from(fullComponent);
      expect(component.getVariantOrDefault('does-not-exist'))
      .to.be.a('Variant')
      .with.property('id')
      .that.equals('component-v1');
    });
    it('returns default variant for undefined search values', function () {
      const component = Component.from(fullComponent);
      expect(component.getVariantOrDefault())
      .to.be.a('Variant')
      .with.property('id')
      .that.equals('component-v1');
    });
  });

  describe('.getViews()', function () {
    it('returns an empty FileCollection if no view filter has been defined', function () {
      const component = Component.from(basicComponent);
      const views = component.getViews();
      expect(views).to.be.a('FileCollection');
      expect(views.length).to.equal(0);
    });

    it('returns an empty FileCollection if no matching views are found', function () {
      const viewConfigComponent = Object.assign({}, fullComponent);
      viewConfigComponent.config.views = {
        match: {
          stem: 'view'
        }
      };
      const component = Component.from(viewConfigComponent);
      const views = component.getViews();
      expect(views).to.be.a('FileCollection');
      expect(views.length).to.equal(0);
    });

    it('returns a filtered list of files as a FileCollection if matching views are found', function () {
      const viewConfigComponent = Object.assign({}, fullComponent);
      viewConfigComponent.config.views = {
        match: {
          extname: '.hbs'
        }
      };
      const component = Component.from(viewConfigComponent);
      const views = component.getViews();
      expect(views).to.be.a('FileCollection');
      expect(views.length).to.equal(1);
    });
  });

  describe('.getView()', function () {
    it('returns undefined if no view filter has been defined', function () {
      const component = Component.from(basicComponent);
      const view = component.getView('extname', '.hbs');
      expect(view).to.be.undefined;
    });

    it('returns undefined if no matching views are found', function () {
      const viewConfigComponent = Object.assign({}, fullComponent);
      viewConfigComponent.config.views = {
        match: {
          stem: 'view'
        }
      };
      const component = Component.from(viewConfigComponent);
      const view = component.getView('extname', '.hbs');
      expect(view).to.be.undefined;
    });

    it('returns the correct File if a matching view is found', function () {
      const viewConfigComponent = Object.assign({}, fullComponent);
      viewConfigComponent.config.views = {
        match: {
          extname: '.hbs'
        }
      };
      const component = Component.from(viewConfigComponent);
      const view = component.getView('extname', '.hbs');
      expect(view).to.be.a('File');
    });
  });

  describe('.isComponent()', function () {
    it('returns true if an instance is a Component', function () {
      expect(Component.isComponent(Component.from(basicComponent))).to.equal(true);
    });
    it('returns false if an instance is not a Component', function () {
      expect(Component.isComponent([])).to.equal(false);
    });
  });

  describe('.get()', function () {
    it(`falls back to the 'fallback' argument if the value is not found in the data store`, function () {
      const component = Component.from(fullComponent);
      expect(component.get('fabulous', 'hair')).to.equal('hair');
    });
  });

  describe('.clone()', function () {
    it('creates a new instance', function () {
      const component = Component.from(basicComponent);
      const newComponent = component.clone();
      expect(Component.isComponent(newComponent)).to.equal(true);
      expect(newComponent).to.not.equal(component);
    });
    it(`preserves the UUID of the component`, function () {
      const component = Component.from(basicComponent);
      const newComponent = component.clone();
      expect(component.uuid).to.equal(newComponent.uuid);
    });
  });

  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const component = Component.from(basicComponent);
      expect(component[Symbol.toStringTag]).to.equal('Component');
    });
  });
});
