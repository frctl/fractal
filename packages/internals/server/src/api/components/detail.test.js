const {join} = require('path');
const {Fractal} = require('@frctl/fractal');
const {expect} = require('../../../../../../test/helpers');
const route = require('./detail')();

function makeContext(params = {component: 'button'}) {
  return {
    fractal: new Fractal({
      src: join(__dirname, '/../../../test/fixtures/components')
    }),
    params,
    body: {}
  };
}

describe('Server route - components/detail', function () {
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
      expect(route.handler(makeContext(), () => {})).to.be.instanceOf(Promise);
    });
    it('sets the status to 404 if the component is not found', async function () {
      const ctx = makeContext({component: 'foo'});
      await route.handler(ctx, () => {});
      expect(ctx.status).to.equal(404);
    });
    it('sets the body to a JSON-ified component if found', async function () {
      const ctx = makeContext();
      await route.handler(ctx, () => {});
      expect(ctx.body).to.have.property('id').that.equals('button');
    });
  });
});
