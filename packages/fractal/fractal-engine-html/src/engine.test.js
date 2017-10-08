/* eslint no-unused-expressions: "off" */
const {expect} = require('../../../../test/helpers');
const engine = require('./engine');

describe('HTML engine', function () {
  describe('factory', function () {
    it('is exported as a function', function () {
      expect(engine).to.be.a('function');
    });
    it('returns a valid engine object', function () {
      const eng = engine();
      expect(eng).to.be.an('object');
      expect(eng.name).to.equal('html');
      expect(eng.match).to.have.members(['.html', '.xhtml', '.html5']);
      expect(eng).to.have.a.property('render').that.is.a('function');
    });
  });
  describe('.render()', function () {
    it('is a noop', async function () {
      const eng = engine();
      expect(await eng.render('test')).to.equal('test');
    });
  });
});
