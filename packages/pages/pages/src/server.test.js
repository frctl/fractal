/* eslint no-unused-expressions: off */

const {Fractal} = require('@frctl/fractal');
const {Server} = require('@frctl/server');
const {expect} = require('../../../../test/helpers');
const serverFactory = require('./server');

const app = new Fractal();

describe('server', function () {
  it('returns a a Server instance', function () {
    const server = serverFactory(app);
    expect(server).to.be.instanceOf(Server);
  });
});
