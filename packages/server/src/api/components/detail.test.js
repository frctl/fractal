const {join} = require('path');
const {Fractal} = require('@frctl/fractal');
const {expect} = require('../../../../../test/helpers');
const route = require('./detail')();

async function makeContext(params = {component: 'button'}) {
  const fractal = new Fractal({
    src: join(__dirname, '/../../../test/fixtures/components')
  });
  const {components, files} = await fractal.parse();
  return {
    status: null,
    fractal,
    params,
    components,
    files,
    throw: function(code){
      this.status = code;
      throw new Error('test')
    },
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
      expect(route.handler(await makeContext(), () => {})).to.be.instanceOf(Promise);
    });
    it('sets the status to 404 if the component is not found', async function () {
      const ctx = await makeContext({component: 'foo'});
      try {
        await route.handler(ctx, () => {});
      } catch(err) {}
      expect(ctx.status).to.equal(404);
    });
    it('sets the body to a JSON-ified component if found', async function () {
      const ctx = await makeContext();
      await route.handler(ctx, () => {});
      expect(ctx.body).to.have.property('id').that.equals('button');
    });
  });
});
