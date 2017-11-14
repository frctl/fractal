const {expect, sinon} = require('../../../../test/helpers');
const Renderer = require('./renderer');

const engines = [{
  name: 'funjucks',
  match: '.fjk',
  render: () => Promise.resolve('the rendered string')
}];

describe('Renderer', function () {
  describe('.render()', function () {
    it('rejects if the template arg is not a Template instance or string', function () {
      const renderer = new Renderer(engines);
      return expect(renderer.render(123)).to.be.rejectedWith('[template-invalid]');
    });
    it('rejects if no appropriate adapter can be found', function () {
      const renderer = new Renderer(engines);
      return expect(renderer.render('woop', {}, {engine: 'foo'})).to.be.rejectedWith('[engine-not-found]');
    });
    it('calls the render method on the appropriate engine and returns the result', async function () {
      const renderer = new Renderer(engines);
      const context = {};
      const opts = {};
      const renderSpy = sinon.spy(engines[0], 'render');
      const result = await renderer.render('<div></div>', context, opts);
      expect(result).to.equal('the rendered string');
      expect(renderSpy.calledWith('<div></div>', context)).to.equal(true);
      expect(renderSpy.getCalls()[0].args[2]).to.have.property('target').that.equals('<div></div>');
      renderSpy.restore();
    });
  });
});
