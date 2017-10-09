/* eslint no-unused-expressions: off, handle-callback-err: off */

const {join} = require('path');
const {Fractal} = require('@frctl/fractal');
const {expect, request} = require('../../../../test/helpers');
const Server = require('../src/api-server');

const app = new Fractal({
  src: join(__dirname, '/fixtures/components'),
  plugins: [
    require('@frctl/fractal-plugin-template-attrs')
  ],
  engines: [
    require('@frctl/fractal-engine-html')
  ]
});

describe('Server requests', function () {
  let server = new Server(app);
  let httpServer;

  before(async function () {
    httpServer = await server.start(4445);
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

  describe('POST /components/:id', function () {
    it('responds with HTML', async function () {
      const res = await request(httpServer)
                          .post('/components/button/render')
                          .send({text: 'foo'});
      expect(res).to.have.status(200);
      expect(res).to.be.html;
    });
    it('throws a 404 if the component is not found', function (done) {
      request(httpServer)
        .post('/components/foo/render')
        .send({text: 'foo'})
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });
    it('returns the default rendered variant of the component', async function () {
      const res = await request(httpServer)
                          .post('/components/button/render')
                          .send({text: 'foo'});
      expect(res.text.includes('button')).to.be.true;
      expect(res.text.includes('class="primary"')).to.be.true;
    });
    it('allows specifying an alternative variant via a query param', async function () {
      const res = await request(httpServer)
                          .post('/components/button/render?variant=secondary')
                          .send({text: 'foo'});
      expect(res.text.includes('class="secondary"')).to.be.true;
    });
  });
});
