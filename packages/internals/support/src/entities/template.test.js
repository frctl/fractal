/* eslint no-unused-expressions: "off" */
const parser = require('reshape-parser');
const generator = require('reshape-code-gen');
const {expect} = require('../../../../../test/helpers');
const Template = require('./template');

const defaultContent = '<span>foo</span>';
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
    it('gets the AST of the template contents', function () {
      const template = makeTemplate(defaultContent);
      expect(template.tree).to.be.an('array');
      expect(template.tree).to.eql(parser(defaultContent));
    });
    it('sets the AST of the template contents', function () {
      const template = makeTemplate(defaultContent);
      template.tree = parser('<strong>asdasd</strong>');
      expect(template.tree).to.eql(parser('<strong>asdasd</strong>'));
    });
  });

  describe('.stringify()', function () {
    it('converts the AST into a string', function () {
      const template = makeTemplate();
      const locals = {foo: 'bar'};
      expect(template.stringify()).to.be.a('string');
      expect(template.stringify()).to.eql(generator(parser(defaultContent))());
      expect(template.stringify(locals)).to.eql(generator(parser(defaultContent))(locals));
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
