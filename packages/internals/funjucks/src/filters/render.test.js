const {File} = require('@frctl/support');
const {Fractal} = require('@frctl/fractal');
const {expect, sinon} = require('../../../../../test/helpers');
const factory = require('./render');

describe('render', function () {
  it('exports a function', function () {
    expect(factory).to.be.a('function');
  });

  it('returns an object with the expected properties', function () {
    const filter = factory();
    expect(filter.name).to.equal('render');
    expect(filter.async).to.equal(true);
    expect(filter.filter).to.be.a('function');
  });

  describe('.filter()', function () {
    const filter = factory();
    const fractal = new Fractal({
      adapters: [
        './test/fixtures/add-ons/adapter'
      ]
    });
    const render = filter.filter.bind({env: {fractal}});
    const target = new File({
      path: 'path/to/view.fjk',
      contents: Buffer.from('the contents')
    });
    const spy = sinon.spy(fractal, 'render');

    afterEach(function () {
      spy.restore();
    });

    it('calls the fractal.render method with the expected arguments and returns the result', function (done) {
      render(target, function (err, result) {
        expect(spy.calledWith(target)).to.equal(true);
        expect(err).to.equal(null);
        expect(result).to.equal('the contents');
        done();
      });
    });
    it('supplies an error argument to the callback if the rendering fails', function (done) {
      const render = filter.filter.bind({fractal});
      const target = new File({
        path: 'path/to/view.hbs',
        contents: Buffer.from('the contents')
      });
      render(target, function (err, result) {
        expect(err).to.be.instanceOf(Error);
        done();
      });
    });
  });
});
