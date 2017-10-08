/* eslint no-unused-expressions: "off" */
const proxyquire = require('proxyquire');
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
    it('instantiates the new template with a DOM tree and the filename', function () {
      let passedArgs;
      class Template {
        constructor(...args) {
          passedArgs = args;
        }
      }
      const Variant = proxyquire('./variant', {
        './template': Template
      });
      const variant = new Variant(defaultProps);
      variant.addTemplate('<span></span>', 'file.html');
      expect(passedArgs[0]).to.be.an('object');
      expect(passedArgs[0].type).to.equal('root');
      expect(passedArgs[1]).to.equal('file.html');
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
