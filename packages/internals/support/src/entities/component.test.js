/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../../test/helpers');
const Collection = require('../collections/collection');
const FileCollection = require('../collections/file-collection');
const File = require('./file');

const Component = require('./component');

const basicComponent = {
  src: new File({path: '/src/component', cwd: '/'})
};

const fullComponent = {
  name: 'component-name-set',
  config: {refresh: true},
  src: new File({path: '/src/component', cwd: '/'}),
  variants: new Collection([{name: 'component--v1'}, {name: 'component--v2'}]),
  files: new FileCollection([new File({path: '/src/component/component.js'}), new File({path: '/src/component/component.hbs'})])
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
    });
    it(`assigns 'name' correctly if set directly`, function () {
      const component = new Component(fullComponent);
      expect(component.name).to.equal('component-name-set');
    });
    it(`creates default 'config', 'variants', and 'files' properties if not set`, function () {
      const component = new Component(basicComponent);
      expect(component).to.have.a.property('config').that.is.an('object');
      expect(component).to.have.a.property('variants').that.is.a('Collection');
      expect(component).to.have.a.property('files').that.is.a('FileCollection');
    });
    it(`creates default 'config', 'variants', and 'files' properties if not provided`, function () {
      const component = new Component(basicComponent);
      expect(component).to.have.a.property('config').that.is.an('object').and.deep.equals({});
      expect(component).to.have.a.property('variants').that.is.a('Collection').and.has.a.property('length').that.equals(0);
      expect(component).to.have.a.property('files').that.is.a('FileCollection').and.has.a.property('length').that.equals(0);
    });
    it(`assigns 'config', 'variants', and 'files' properties correctly if provided`, function () {
      const component = new Component(fullComponent);
      expect(component).to.have.a.property('config').that.is.an('object').and.deep.eqls(fullComponent.config);
      expect(component).to.have.a.property('config').that.is.an('object').and.not.equals(fullComponent.config);
      expect(component).to.have.a.property('variants').that.is.a('Collection').and.has.a.property('length').that.equals(2);
      expect(component).to.have.a.property('files').that.is.a('FileCollection').and.has.a.property('length').that.equals(2);
    });
    it(`proxies access to its 'src.path' and 'src.relative' properties`, function () {
      const component = new Component(basicComponent);
      expect(component).to.have.a.property('path').that.is.an('string').and.equals('/src/component');
      expect(component).to.have.a.property('relative').that.is.a('string').and.equals('src/component');
    });
    it('throws an error if incorrect properties provided', function () {
      expect(() => new Component()).to.throw(TypeError, '[properties-invalid]');
    });
  });
  describe('.files', function () {
    it('sets files correctly', function () {
      const component = new Component(basicComponent);
      expect(component.files.length).to.equal(0);
      expect(component.files = FileCollection.from(fullComponent.files)).to.not.throw;
      expect(component.files.length).to.equal(2);
      expect(() => {
        component.files = [];
      }).to.throw(TypeError, `[files-invalid]`);
    });
  });
  describe('.variants', function () {
    it('sets variants correctly', function () {
      const component = new Component(basicComponent);
      expect(component.variants.length).to.equal(0);
      expect(component.variants = Collection.from(fullComponent.variants)).to.not.throw;
      expect(component.variants.length).to.equal(2);
      expect(() => {
        component.variants = [];
      }).to.throw(TypeError, `[variants-invalid]`);
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
  describe('.set()/get()', function () {
    it('sets and gets a value on the private data store', function () {
      const component = new Component(basicComponent);
      component.set('foo', 'bar');
      expect(component.foo).to.not.exist;
      expect(component.get('foo')).to.equal('bar');
    });
    it('sets and gets nested paths', function () {
      const component = new Component(basicComponent);
      component.set('foo.bar[0]', 'one');
      expect(component.get('foo.bar[0]')).to.equal('one');
      expect(component.get('foo')).to.eql({bar: ['one']});
    });
  });
  describe('.set()', function () {
    it('returns a reference to the component', function () {
      const component = new Component(basicComponent);
      expect(component.set('foo', 'bar')).to.equal(component);
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
    it('creates a copy of the original value', function () {
      const component = new Component(basicComponent);
      const status = {
        tag: 'wip',
        label: 'Work in progress'
      };
      component.set('status', status);
      expect(component.get('status')).to.not.equal(status);
    });
  });
  describe('[Symbol.toStringTag]', function () {
    it('should resolve correctly', function () {
      const component = new Component(basicComponent);
      expect(component[Symbol.toStringTag]).to.equal('Component');
    });
  });
});
