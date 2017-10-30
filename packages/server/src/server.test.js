/* eslint no-unused-expressions: off */

const {Fractal} = require('@frctl/fractal');
const {expect, request} = require('../../../test/helpers');
const Server = require('./server');

const app = new Fractal();

describe('Server', function () {
  describe('.start()', function () {
    it('starts a server and returns a promise when ready', function (done) {
      const server = new Server(app);
      server.start(4446).then(httpServer => {
        request(httpServer).get('/foo').end((err, res) => {
          expect(res).to.have.status(404);
          server.stop();
          done();
        });
      });
    });
  });
});
