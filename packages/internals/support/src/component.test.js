/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../test/helpers');
const Collection = require('./collection');
const File = require('./file');
const FileCollection = require('./file-collection');

const Component = require('./component');

const basicComponent = {
  name: 'component',
  path: '/path/to/component',
  relative: 'path/to/component',
  config: {},
  src: new File({path: '/src/test.js'}),
  variants: new Collection(),
  files: new FileCollection()
};

describe('Component', function () {
  describe('constructor', function () {
    it('returns a new instance if correct properties provided', function () {
      const component = new Component(basicComponent);
      expect(component).to.exist;
    });
    it('throws an error if incorrect properties provided', function () {
      expect(() => new Component()).to.throw(TypeError, '[properties-invalid]');
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
  describe('[Symbol.toStringTag]', function () {
    const component = new Component(basicComponent);
    expect(component[Symbol.toStringTag]).to.equal('Component');
  });
});
