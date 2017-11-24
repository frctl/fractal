/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../../test/helpers');
const Template = require('./template');

const templateData = {
  cwd: '/',
  base: '/test/',
  path: '/test/file.js',
  contents: new Buffer('<div></div>')
};
const makeTemplate = props => new Template(props || templateData);

describe('Template', function () {
  describe('constructor', function () {
    it(`creates a new instance of a Template`, function () {
      const template = makeTemplate();
      expect(template).to.exist;
      expect(template instanceof Template).to.be.true;
    });
    it('throws an error on invalid props', function () {
      expect(() => makeTemplate({
        foo: 'bar'
      })).to.throw(`[properties-invalid]`);
    });
  });

  describe('.transform()', function () {
    it('accepts a function that mutates the contents', function () {
      const template = makeTemplate();
      template.transform(contents => {
        contents.children[0].tagName = 'span';
      });
      expect(template.contents).to.equal('<span></span>');
    });
  });

  describe('get .contents', function () {
    it('returns the contents as a string', function () {
      const template = makeTemplate();
      expect(template.contents).to.be.a('string');
    });
  });

  describe('set .contents', function () {
    it('sets the contents', function () {
      const template = makeTemplate();
      template.contents = '<br>';
      expect(template.contents).to.equal('<br>');
    });
    it('throws an error if contents is invalid', function () {
      const template = makeTemplate();
      expect(() => {
        template.contents = {};
      }).to.throw('[invalid-contents]');
    });
  });

  describe('.clone()', function () {
    it('creates a new instance', function () {
      const template = makeTemplate();
      const newTemplate = template.clone();
      expect(Template.isTemplate(newTemplate)).to.equal(true);
      expect(newTemplate).to.not.equal(template);
      expect(newTemplate.getProps()).to.eql(template.getProps());
    });
    it('does not break the vdom handling', function () {
      const template = makeTemplate();
      const newTemplate = template.clone();
      newTemplate.transform(dom => {
        dom.children[0].tagName = 'span';
      })
      expect(newTemplate.contents).to.equal('<span></span>');
      expect(template.contents).to.equal('<div></div>');
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
