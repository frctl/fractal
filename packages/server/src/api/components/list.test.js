const {join} = require('path');
const {Fractal} = require('@frctl/fractal');
const {expect} = require('../../../../../test/helpers');
const route = require('./list')();

async function makeContext(params = {component: 'button'}) {
  const fractal = new Fractal({
    src: join(__dirname, '/../../../test/fixtures/components')
  });
  const {components, files} = await fractal.parse();
  return {
    fractal,
    params,
    components,
    files,
    body: {}
  };
}

describe('Server route - components/list', function () {
  describe('.method', function () {
    it('is a GET method', function () {
      expect(route.method).to.equal('get');
    });
  });

  describe('.path', function () {
    it('is a valid path', function () {
      expect(route.path).to.be.a('string');
    });
  });

  describe('.handler()', function () {
    it('is asynchronous', async function () {
      expect(route.handler(await makeContext(), () => {})).to.be.instanceOf(Promise);
    });
    it('returns an array of simple component objects', async function () {
      const ctx = await makeContext();
      await route.handler(ctx, () => {});
      expect(ctx.body).to.be.an('array');
      expect(ctx.body[0]).to.have.property('id');
      expect(ctx.body[0]).to.have.property('variants');
    });
  });
});
