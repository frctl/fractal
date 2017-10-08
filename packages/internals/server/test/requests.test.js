/* eslint no-unused-expressions: off */

const {join} = require('path');
const {Fractal} = require('@frctl/fractal');
const {expect, request} = require('../../../../test/helpers');
const Server = require('../src/server');

const app = new Fractal({
  src: join(__dirname, '/../../../../test/fixtures/components')
});

describe('Server requests', function () {
  let server = new Server(app);
  let httpServer;

  before(async function () {
    httpServer = await server.start(4444);
  });

  after(function () {
    server.stop();
  });

  describe('GET /', function () {
    it('responds with JSON', async function () {
      const res = await request(httpServer).get('/');
      expect(res).to.have.status(200);
      expect(res).to.be.json;
    });
    it('contains an object with information on the Fractal instance', async function () {
      const res = await request(httpServer).get('/');
      expect(res.body.fractal).to.have.property('version');
    });
  });

  describe('GET /components', function () {
    it('responds with JSON', async function () {
      const res = await request(httpServer).get('/components');
      expect(res).to.have.status(200);
      expect(res).to.be.json;
    });
    it('returns an array of components', async function () {
      const res = await request(httpServer).get('/components');
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('id');
      expect(res.body[0]).to.have.property('variants');
    });
  });

  describe('GET /components/:id', function () {
    it('responds with JSON', async function () {
      const res = await request(httpServer).get('/components/button');
      expect(res).to.have.status(200);
      expect(res).to.be.json;
    });
    it('returns a component detail object', async function () {
      const res = await request(httpServer).get('/components/button');
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('id');
    });
  });
});
