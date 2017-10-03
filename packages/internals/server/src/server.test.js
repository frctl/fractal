/* eslint no-unused-expressions: off */

const {Fractal} = require('@frctl/fractal');
const {expect, request} = require('../../../../test/helpers');
const Server = require('./server');

const app = new Fractal();

describe('Server', function () {
  describe('.start()', function () {
    it('starts a server and returns a promise when ready', async function () {
      const server = new Server(app);
      const httpServer = await server.start(4444);
      const res = await request(httpServer).get('/');
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      server.stop();
    });
    it('rejects the promise if no port is defined', function () {
      const server = new Server(app);
      return expect(server.start()).to.eventually.be.rejectedWith('[port-missing]');
    });
  });
});
