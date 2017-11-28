/* eslint no-unused-expressions: off */

const {Fractal} = require('@frctl/fractal');
const {Server} = require('@frctl/server');
const {expect} = require('../../../test/helpers');
const serverFactory = require('./server');
const Pages = require('./app');

const fractal = new Fractal();
const app = new Pages(fractal, {
  dest: './'
});

describe('server', function () {
  it('returns a promise that resolves to a Server instance', function () {
    const server = serverFactory(app);
    expect(server).to.eventually.be.instanceOf(Server);
  });
});
