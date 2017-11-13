const {Fractal} = require('@frctl/fractal');
const {ComponentCollection, Component, FileCollection, File} = require('@frctl/support');
const {expect, sinon} = require('../../../../../test/helpers');
const factory = require('./render');

const files = new FileCollection([
  new File({path: 'components/@test-component'}),
  new File({
    name: 'view',
    path: 'components/@test-component/view.fjk',
    contents: Buffer.from('component!')
  })
]);

const components = new ComponentCollection([
  Component.from({
    src: files.find({
      stem: '@test-component'
    }),
    files: FileCollection.from([
      new File({
        name: 'view',
        base: 'components/@test-component',
        path: 'components/@test-component/view.fjk',
        contents: Buffer.from('test')
      })
    ]),
    config: {
      id: 'test-component',
      views: {
        match: 'view.*'
      },
      variants: [{
        id: 'default',
        context: {
          foo: 'bar'
        }
      }]
    }
  })
]);

const fractal = new Fractal({
  engines: [
    './test/fixtures/add-ons/engine'
  ]
});

sinon.stub(fractal, 'parse').callsFake(() => Promise.resolve({components, files}));

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
    let spy;
    let render;

    before(async function(){
      filter = factory();
      render = filter.filter.bind({
        env: {fractal, components}
      });
      spy = sinon.stub(fractal, 'render').callsFake(() => Promise.resolve('result'));
    });

    afterEach(() => spy.restore());

    it('looks up and renders variants', function (done) {
      render('test-component.fjk', function (err, result) {
        expect(err).to.equal(null);
        expect(spy.calledWith(components.first().getVariant())).to.equal(true);
        expect(spy.getCalls()[0].args[2].ext).to.equal('.fjk');
        expect(result).to.equal('result');
        done();
      });
    });
    it('supplies an error argument to the callback if the rendering fails', function (done) {
      render('foo', function (err, result) {
        expect(err).to.be.instanceOf(Error);
        done();
      });
    });
  });
});
