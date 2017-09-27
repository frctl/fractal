const {Template} = require('@frctl/support');
const {expect, sinon} = require('../../../../test/helpers');
const Renderer = require('./renderer');

const engines = [{
  name: 'funjucks',
  match: '.fjk',
  render: () => Promise.resolve('the rendered string')
}];

const funjucksTemplate = new Template('asdasd', 'path/to/file.fjk');
const otherTemplate = new Template('asdasd', 'path/to/file.foo');

describe('Renderer', function () {
  describe('.render()', function () {
    it('rejects if the template arg is not a Template instance', function () {
      const renderer = new Renderer(engines);
      return expect(renderer.render('foo')).to.be.rejectedWith('[template-invalid]');
    });
    it('rejects if no appropriate adapter can be found', function () {
      const renderer = new Renderer(engines);
      return expect(renderer.render(otherTemplate)).to.be.rejectedWith('[engine-not-found]');
    });
    it('calls the render method on the appropriate engine and returns the result', async function () {
      const renderer = new Renderer(engines);
      const context = {};
      const opts = {};
      const renderSpy = sinon.spy(engines[0], 'render');
      const cloneSpy = sinon.spy(funjucksTemplate, 'clone');
      const result = await renderer.render(funjucksTemplate, context, opts);
      expect(result).to.equal('the rendered string');
      expect(renderSpy.calledWith(funjucksTemplate, context, opts)).to.equal(true);
      expect(cloneSpy.called).to.equal(true);
      cloneSpy.restore();
      renderSpy.restore();
    });
  });
});
