const {Fractal} = require('@frctl/fractal');
const {expect} = require('../../../../test/helpers');
const ApiServer = require('./api-server');
const Server = require('./server');

const app = new Fractal();

describe('ApiServer', function () {
  it('extends Server', function () {
    expect(new ApiServer(app)).to.be.instanceOf(Server);
  });

  it('binds all the expected routes');
  it('adds the Fractal instance to the shared ctx object');
});
