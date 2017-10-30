/* eslint no-unused-expressions: off */

const {Fractal} = require('@frctl/fractal');
const {ApiServer} = require('@frctl/server');
const {expect} = require('../../../test/helpers');
const serverFactory = require('./server');

const app = new Fractal();

describe('server', function () {
  it('returns a promise that resolves to a Server instance', function () {
    const server = serverFactory(app);
    expect(server).to.eventually.be.instanceOf(ApiServer);
  });

  describe('Server instance', function () {
    it('has a socket.io instance bound', async function () {
      const server = await serverFactory(app);
      expect(server.app.socket).to.have.property('broadcast');
    });

    it('mounts the API routes under the `_api` namespace');
    it('starts the fractal watch task');
    it('emits `changed` events via the websocket when changes are made to the Fractal src files');
    it('uses the webpack dev middleware in development mode');
    it('uses the `dist` app bundle in production mode');
    it('responds to all non-asset URLs with the core SPA skeleton HTML');
  });
});
