const {join} = require('path');
const {Fractal} = require('@frctl/fractal');
const {expect} = require('../../../../test/helpers');
const route = require('./render')();

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

describe('Server route - render', function () {
  describe('.method', function () {
    it('is a POST method', function () {
      expect(route.method).to.equal('post');
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
    it('Sets the body to an array');
    it('Renders each requestes variant/scenario/ext combination and returns a summary object for each');
  });
});
