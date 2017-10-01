/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../../test/helpers');
const Template = require('./template');

const defaultContent = {};
const makeTemplate = (content, filename) => new Template(content || defaultContent, filename || 'foo.html');

describe('Template', function () {
  describe('constructor', function () {
    it(`creates a new instance of a Template`, function () {
      const template = makeTemplate();
      expect(template).to.exist;
      expect(template instanceof Template).to.be.true;
    });
  });

  describe('.filename', function () {
    it('gets the filename', function () {
      const template = makeTemplate();
      expect(template.filename).to.equal('foo.html');
    });
  });

  describe('.tree', function () {
    it('returns the template AST', function () {
      const template = makeTemplate(defaultContent);
      expect(template.tree).to.be.an('object');
      expect(template.tree).to.eql(defaultContent);
    });
  });

  describe('.isTemplate()', function () {
    it('returns true if item is a Template and false otherwise', function () {
      const template = makeTemplate();
      expect(Template.isTemplate(template)).to.be.true;
      expect(Template.isTemplate({})).to.be.false;
    });
  });
  describe('.[Symbol.toStringTag]', function () {
    const template = makeTemplate();
    expect(template[Symbol.toStringTag]).to.equal('Template');
  });
});
