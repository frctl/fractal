/* eslint no-unused-expressions: "off" */
const Handlebars = require('handlebars');
const {expect} = require('../../../test/helpers');
const engine = require('./engine');

describe('Handlebars engine', function () {
  describe('factory', function () {
    it('is exported as a function', function () {
      expect(engine).to.be.a('function');
    });
    it('returns a valid engine object', function () {
      const eng = engine();
      expect(eng).to.be.an('object');
      expect(eng.name).to.equal('handlebars');
      expect(eng.match).to.have.members(['.hbs', '.handlebars']);
      expect(eng).to.have.a.property('render').that.is.a('function');
    });
  });
  describe('.render()', function () {
    it('returns a promise that resolves to a string', async function () {
      const eng = engine();
      return expect(eng.render('test')).to.eventually.equal('test');
    });
    it('renders handlebars templates with the provided context data', async function () {
      const eng = engine();
      return expect(eng.render('{{ foo }}', {foo: 'bar'})).to.eventually.equal('bar');
    });
    it('supports passing a custom handlebars instance', async function () {
      const env = Handlebars.create();
      env.registerHelper('foo', str => str + 'bar');
      const eng = engine({
        handlebars: env
      });
      return expect(eng.render('{{foo "test"}}')).to.eventually.equal('testbar');
    });
  });
});
