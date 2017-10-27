/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../../test/helpers');
const Template = require('./template');

const defaultContent = {};
const makeTemplate = (content, filename) => new Template({contents: content || defaultContent, filename: filename || 'foo.html'});

describe('Template', function () {
  describe('constructor', function () {
    it(`creates a new instance of a Template`, function () {
      const template = makeTemplate();
      expect(template).to.exist;
      expect(template instanceof Template).to.be.true;
    });
    it('accepts a DOM tree as contents');
    it('accepts a string as contents');
  });

  describe('.filename', function () {
    it('gets the filename', function () {
      const template = makeTemplate();
      expect(template.filename).to.equal('foo.html');
    });
  });

  describe('.extname', function () {
    it('gets the file extension', function () {
      const template = makeTemplate();
      expect(template.extname).to.equal('.html');
    });
  });

  describe('.contents', function () {
    it('returns the template AST', function () {
      const template = makeTemplate(defaultContent);
      expect(template.contents).to.be.an('object');
      expect(template.contents).to.eql(defaultContent);
    });
  });

  describe('.clone', function () {
    it('clones the template including the DOM tree', function () {
      const template = makeTemplate(defaultContent);
      const cloned = template.clone();
      expect(template).to.eql(cloned);
      expect(template).to.not.equal(cloned);
      expect(template.contents).to.eql(cloned.contents);
      expect(template.contents).to.not.equal(cloned.contents);
    });
  });

  describe('.toString()', function () {
    it('stringifies the template', function () {
      const template = makeTemplate('<span></span>');
      expect(template.toString()).to.equal('<span></span>');
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
