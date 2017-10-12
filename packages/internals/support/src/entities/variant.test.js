/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../../test/helpers');
const reservedWords = require('../../reserved-words');
const Collection = require('../collections/collection');
const Variant = require('./variant');
const Entity = require('./entity');
const Template = require('./template');

const defaultProps = {
  id: 'variant'
};

const makeVariant = props => new Variant(props || defaultProps);

describe('Variant', function () {
  describe('constructor', function () {
    it(`creates a new instance of a Variant with expected superclass`, function () {
      const variant = makeVariant();
      expect(variant).to.exist;
      expect(variant instanceof Variant).to.be.true;
      expect(variant instanceof Entity).to.be.true;
    });
    it(`throws an error when invalid props supplied`, function () {
      expect(() => makeVariant(['invalid', 'array'])).to.throw(TypeError, '[properties-invalid]');
      expect(() => makeVariant('invalid string')).to.throw(TypeError, '[properties-invalid]');
    });
    it('sets properties that are not in the reserved words list', function () {
      const variant = makeVariant({
        id: 'foo',
        foo: 'bar',
        previews: [],
        views: {},
        scenarios: [],
        templates: {}
      });
      for (const prop of reservedWords) {
        expect(variant[prop]).to.equal(undefined);
      }
      expect(variant.id).to.equal('foo');
      expect(variant.foo).to.equal('bar');
    });
  });

  describe('.id', function () {
    it('is generated from the label if not set in props');
  });

  describe('.label', function () {
    it('is generated from the id if not set in props');
  });

  describe('.getTemplates()', function () {
    it('returns a collection', function () {
      const variant = makeVariant();
      expect(variant.getTemplates()).to.be.instanceOf(Collection);
    });
  });

  describe('.addTemplate()', function () {
    it('creates a new template and adds it to the template set', function () {
      const variant = makeVariant();
      variant.addTemplate('<span></span>', 'file.html');
      expect(variant.getTemplates().length).to.equal(1);
      expect(variant.getTemplate()).to.be.instanceOf(Template);
    });
  });

  describe('.isVariant()', function () {
    it('returns true if item is a Variant and false otherwise', function () {
      const variant = makeVariant();
      expect(Variant.isVariant(variant)).to.be.true;
      expect(Variant.isVariant({})).to.be.false;
    });
  });
  describe('.[Symbol.toStringTag]', function () {
    const variant = makeVariant();
    expect(variant[Symbol.toStringTag]).to.equal('Variant');
  });
});
